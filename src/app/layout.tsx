import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mall of America | Cinematic Sales Experience",
  description:
    "An immersive, non-linear sales experience for leasing, sponsorship, and event booking at Mall of America.",
  applicationName: "MOA Sales Experience",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Mall of America | Cinematic Sales Experience",
    description:
      "A premium interactive destination pitch for leasing, sponsorship, and events.",
    images: ["/media/moa-poster.webp"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050506"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/media/moa-poster.webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
