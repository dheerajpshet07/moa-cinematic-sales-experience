"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Sparkles } from "lucide-react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const zones = [
  {
    id: "rotunda",
    label: "Rotunda",
    type: "Launch",
    x: 51,
    y: 46,
    copy: "Own the center of attention with stage, media, crowd flow, and multi-level sightlines."
  },
  {
    id: "luxury",
    label: "North retail",
    type: "Flagship",
    x: 33,
    y: 36,
    copy: "A premium path for high-intent tenants who need adjacency, visibility, and repeat traffic."
  },
  {
    id: "park",
    label: "Attraction core",
    type: "Sponsor",
    x: 63,
    y: 62,
    copy: "Turn family entertainment into an always-on sponsorship and experiential media surface."
  }
] as const;

type ZoneId = (typeof zones)[number]["id"];

export default function ExperienceMap() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeZone, setActiveZone] = useState<ZoneId>("rotunda");
  const [takeover, setTakeover] = useState(false);
  const [brandName, setBrandName] = useState("YOUR BRAND");
  const activeZoneRef = useRef<ZoneId>("rotunda");
  const takeoverRef = useRef(false);

  useEffect(() => {
    activeZoneRef.current = activeZone;
  }, [activeZone]);

  useEffect(() => {
    takeoverRef.current = takeover;
  }, [takeover]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050506, 7.5, 16);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(4.2, 5.1, 7.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xf7efe1, 0.7);
    const key = new THREE.DirectionalLight(0xffd78a, 2.2);
    key.position.set(4, 7, 5);
    const aqua = new THREE.PointLight(0x51d2cd, 2.4, 11);
    aqua.position.set(-3.4, 2.4, 2.2);
    const ember = new THREE.PointLight(0xe45835, 1.4, 10);
    ember.position.set(3.5, 1.8, -2.4);
    scene.add(ambient, key, aqua, ember);

    const mall = new THREE.Group();
    mall.rotation.x = -0.13;
    scene.add(mall);

    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x181513,
      metalness: 0.45,
      roughness: 0.36
    });
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd5a546,
      emissive: 0x6b4212,
      emissiveIntensity: 0.38,
      metalness: 0.55,
      roughness: 0.22
    });
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8fe8e4,
      transparent: true,
      opacity: 0.16,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.4
    });

    const floorShapes = [
      { y: 0, w: 6.9, d: 4.6 },
      { y: 0.48, w: 6.1, d: 4.02 },
      { y: 0.96, w: 5.2, d: 3.42 }
    ];

    floorShapes.forEach((floor, index) => {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(floor.w, 0.14, floor.d), baseMaterial);
      slab.position.y = floor.y;
      slab.castShadow = false;
      slab.receiveShadow = true;
      mall.add(slab);

      const rail = new THREE.Mesh(new THREE.BoxGeometry(floor.w + 0.12, 0.04, floor.d + 0.12), edgeMaterial);
      rail.position.y = floor.y + 0.11;
      rail.scale.set(1, 1, 1);
      mall.add(rail);

      const atrium = new THREE.Mesh(
        new THREE.TorusGeometry(1.18 + index * 0.1, 0.025, 12, 96),
        edgeMaterial
      );
      atrium.rotation.x = Math.PI / 2;
      atrium.position.y = floor.y + 0.18;
      mall.add(atrium);
    });

    const skylight = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.8, 0.36, 64, 1, true), glassMaterial);
    skylight.position.y = 1.45;
    mall.add(skylight);

    const storeMaterial = new THREE.MeshStandardMaterial({
      color: 0x25201d,
      emissive: 0x19100a,
      emissiveIntensity: 0.22,
      roughness: 0.42,
      metalness: 0.22
    });

    for (let i = 0; i < 48; i += 1) {
      const angle = (i / 48) * Math.PI * 2;
      const radiusX = i % 2 === 0 ? 3.1 : 2.4;
      const radiusZ = i % 2 === 0 ? 1.92 : 1.42;
      const store = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.42 + (i % 4) * 0.04, 0.22), storeMaterial);
      store.position.set(Math.cos(angle) * radiusX, 0.34 + (i % 3) * 0.23, Math.sin(angle) * radiusZ);
      store.rotation.y = -angle;
      mall.add(store);
    }

    const hotspotMaterials: Record<ZoneId, THREE.MeshStandardMaterial> = {
      rotunda: new THREE.MeshStandardMaterial({ color: 0xd5a546, emissive: 0xd5a546, emissiveIntensity: 1 }),
      luxury: new THREE.MeshStandardMaterial({ color: 0xf5efe7, emissive: 0x8f7350, emissiveIntensity: 0.7 }),
      park: new THREE.MeshStandardMaterial({ color: 0x8dd35f, emissive: 0x4f9b2c, emissiveIntensity: 0.9 })
    };
    const hotspotPositions: Record<ZoneId, THREE.Vector3> = {
      rotunda: new THREE.Vector3(0, 1.55, 0),
      luxury: new THREE.Vector3(-2.05, 1.08, -0.92),
      park: new THREE.Vector3(1.8, 0.76, 1.1)
    };
    const hotspotMeshes = Object.entries(hotspotPositions).map(([id, position]) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 24, 24),
        hotspotMaterials[id as ZoneId]
      );
      mesh.position.copy(position);
      mall.add(mesh);
      return { id: id as ZoneId, mesh };
    });

    const crowdGeometry = new THREE.BufferGeometry();
    const crowdCount = 280;
    const positions = new Float32Array(crowdCount * 3);
    for (let i = 0; i < crowdCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.35 + Math.random() * 1.55;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 0.23 + Math.random() * 0.05;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    crowdGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const crowdMaterial = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xf6f2ea,
      transparent: true,
      opacity: 0.25,
      depthWrite: false
    });
    const crowd = new THREE.Points(crowdGeometry, crowdMaterial);
    mall.add(crowd);

    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0xd5a546,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const beams = new THREE.Group();
    for (let i = 0; i < 5; i += 1) {
      const beam = new THREE.Mesh(new THREE.ConeGeometry(0.23, 2.4, 4, 1, true), beamMaterial);
      beam.position.set(-1.5 + i * 0.72, 1.65, -0.2 + (i % 2) * 0.42);
      beam.rotation.x = Math.PI / 2.8;
      beam.rotation.z = i * 0.42;
      beams.add(beam);
    }
    mall.add(beams);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener("pointermove", onPointerMove);

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    let frame = 0;
    let disposed = false;

    const animateScene = () => {
      if (disposed) {
        return;
      }
      frame += 0.01;
      mall.rotation.y = Math.sin(frame * 0.65) * 0.1 + pointer.x * 0.12;
      camera.position.x += (4.2 + pointer.x * 0.5 - camera.position.x) * 0.04;
      camera.position.y += (5.1 - pointer.y * 0.32 - camera.position.y) * 0.04;
      camera.lookAt(0, 0.55, 0);

      const takeoverMix = takeoverRef.current ? 1 : 0;
      crowdMaterial.opacity += (0.16 + takeoverMix * 0.62 - crowdMaterial.opacity) * 0.045;
      crowd.rotation.y += 0.0015 + takeoverMix * 0.002;
      beamMaterial.opacity += (0.05 + takeoverMix * 0.24 - beamMaterial.opacity) * 0.06;
      beams.rotation.y = Math.sin(frame * 1.6) * 0.18;
      beams.scale.setScalar(0.75 + takeoverMix * 0.42 + Math.sin(frame * 3) * 0.018);

      hotspotMeshes.forEach(({ id, mesh }, index) => {
        const selected = activeZoneRef.current === id;
        mesh.scale.setScalar((selected ? 1.55 : 1) + Math.sin(frame * 5 + index) * 0.12);
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animateScene);
    };
    animateScene();

    return () => {
      disposed = true;
      observer.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      crowdGeometry.dispose();
      beamMaterial.dispose();
      hotspotMeshes.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      mount.removeChild(renderer.domElement);
    };
  }, []);

  const selected = zones.find((zone) => zone.id === activeZone) ?? zones[0];

  return (
      <div className="section-inner">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow">Place your brand here</p>
            <h2 className="section-title mt-5">Turn foot traffic into a moment.</h2>
            <p className="body-large mt-6">
              The experience shifts from property data to a believable activation scene:
              a partner can picture the exact place their audience gathers, looks up, and
              remembers the brand.
            </p>
          </div>
          <div className="glass rounded-[8px] p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-4xl font-bold text-white">4</p>
                <p className="mt-1 text-sm text-white/55">activation surfaces</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">3</p>
                <p className="mt-1 text-sm text-white/55">audience paths</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">1</p>
                <p className="mt-1 text-sm text-white/55">center-stage story</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid min-h-[680px] gap-4 lg:grid-cols-[1fr_360px]">
          <div className="reveal-card min-h-[520px] overflow-hidden bg-[#070707]">
            <div ref={mountRef} className="absolute inset-0" data-qa="three-map-canvas" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent,rgba(0,0,0,0.62)_76%)]" />

            <motion.div
              className="pointer-events-none absolute left-1/2 top-[40%] z-10 w-[min(460px,72%)] -translate-x-1/2 rounded-[8px] border border-white/18 bg-black/50 px-5 py-4 text-center shadow-[0_0_80px_rgba(213,165,70,0.2)] backdrop-blur-xl"
              animate={{
                opacity: takeover ? 1 : 0.28,
                scale: takeover ? 1 : 0.92
              }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-bold uppercase text-[#d5a546]">Now appearing</p>
              <p className="mt-2 truncate text-3xl font-bold uppercase tracking-normal text-white sm:text-5xl">
                {brandName || "YOUR BRAND"}
              </p>
            </motion.div>

            {zones.map((zone) => (
              <button
                key={zone.id}
                type="button"
                className={cn(
                  "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold uppercase backdrop-blur-xl transition",
                  activeZone === zone.id
                    ? "border-[#d5a546] bg-[#d5a546] text-black"
                    : "border-white/18 bg-black/45 text-white hover:border-white/45"
                )}
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                onClick={() => setActiveZone(zone.id)}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {zone.label}
              </button>
            ))}

            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-white/12 bg-black/45 p-3 backdrop-blur-xl">
              <div>
                <p className="text-xs font-bold uppercase text-white/50">{selected.type}</p>
                <p className="mt-1 text-lg font-bold text-white">{selected.label}</p>
              </div>
              <button
                type="button"
                onClick={() => setTakeover((value) => !value)}
                className={cn("cta-button min-h-11", takeover && "bg-[#51d2cd]")}
              >
                <Sparkles size={17} aria-hidden="true" />
                {takeover ? "Live takeover" : "Activate takeover"}
              </button>
            </div>
          </div>

          <motion.aside
            key={`${selected.id}-${takeover}`}
            className="glass rounded-[8px] p-6"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.36 }}
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
              <Maximize2 size={20} aria-hidden="true" />
            </div>
            <p className="mt-7 text-sm font-bold uppercase text-[#d5a546]">{selected.type}</p>
            <h3 className="mt-3 text-4xl font-bold leading-none text-white">{selected.label}</h3>
            <p className="mt-5 text-base leading-7 text-white/64">{selected.copy}</p>
            <label className="mt-7 block">
              <span className="text-xs font-bold uppercase text-white/42">Brand simulation</span>
              <input
                value={brandName}
                onChange={(event) => setBrandName(event.target.value.slice(0, 22))}
                className="mt-3 h-12 w-full rounded-[8px] border border-white/12 bg-black/35 px-4 text-base font-bold uppercase text-white outline-none transition placeholder:text-white/28 focus:border-[#d5a546]"
                placeholder="Your brand"
              />
            </label>
            <div className="mt-8 space-y-3">
              {["Media wall", "Crowd pulse", "Retail spillover", "Booking handoff"].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b border-white/10 pb-3 text-sm"
                >
                  <span className="font-semibold text-white/72">{item}</span>
                  <span className="text-white/42">{takeover ? "on" : index === 0 ? "ready" : "idle"}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs leading-5 text-white/38">
              {/* Emotional-impact rationale: the standout interaction moves prospects from abstract statistics to embodied imagination. By letting them activate lights, crowd energy, and branded zones inside a 3D property model, the app creates ownership before the sales conversation asks for commitment. */}
              A believable preview of presence is more persuasive than a static inventory list.
            </p>
          </motion.aside>
        </div>
      </div>
  );
}
