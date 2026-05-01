import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const candidates = [
      process.env.PLAYWRIGHT_MODULE_PATH,
      path.join(
        homedir(),
        ".cache",
        "codex-runtimes",
        "codex-primary-runtime",
        "dependencies",
        "node",
        "node_modules",
        "playwright"
      )
    ].filter(Boolean);

    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return require(candidate);
      }
    }

    throw new Error("Playwright is not installed. Install it locally or set PLAYWRIGHT_MODULE_PATH.");
  }
}

const { chromium } = await loadPlaywright();

const baseURL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3000";

const viewports = [
  { name: "desktop", width: 1440, height: 980 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 }
];

for (const viewport of viewports) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  const messages = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      messages.push(message.text());
    }
  });
  page.on("pageerror", (error) => messages.push(error.message));

  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const heroVideo = await page.locator("video").first();
  await heroVideo.waitFor({ state: "attached" });
  const videoState = await heroVideo.evaluate((video) => ({
    readyState: video.readyState,
    width: video.videoWidth,
    height: video.videoHeight,
    paused: video.paused
  }));

  if (videoState.width === 0 || videoState.height === 0 || videoState.readyState < 2) {
    throw new Error(`${viewport.name}: hero video did not load correctly: ${JSON.stringify(videoState)}`);
  }

  await page.locator("#takeover").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  const canvas = page.locator("[data-qa='three-map-canvas'] canvas").first();
  await canvas.waitFor({ state: "visible" });
  const pixels = await canvas.evaluate((element) => {
    const canvasElement = element;
    const context = canvasElement.getContext("webgl2") || canvasElement.getContext("webgl");
    if (!context) return { sample: 0, width: canvasElement.width, height: canvasElement.height };
    const width = canvasElement.width;
    const height = canvasElement.height;
    const data = new Uint8Array(4);
    const points = [
      [0.5, 0.5],
      [0.38, 0.42],
      [0.62, 0.58],
      [0.48, 0.32],
      [0.55, 0.68]
    ];
    let sample = 0;
    for (const [x, y] of points) {
      context.readPixels(Math.floor(width * x), Math.floor(height * y), 1, 1, context.RGBA, context.UNSIGNED_BYTE, data);
      sample += data[0] + data[1] + data[2] + data[3];
    }
    return { sample, width, height };
  });

  if (pixels.sample === 0 || pixels.width < 200 || pixels.height < 200) {
    throw new Error(`${viewport.name}: 3D canvas appears blank: ${JSON.stringify(pixels)}`);
  }

  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight * 0.72, 420);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    for (let y = 0; y <= max; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 120));
    }
  });
  await page.waitForTimeout(600);

  await page.screenshot({ path: `qa-${viewport.name}.png`, fullPage: true });
  await browser.close();

  if (messages.length > 0) {
    throw new Error(`${viewport.name}: console errors\n${messages.join("\n")}`);
  }
}

console.log("QA smoke passed");
