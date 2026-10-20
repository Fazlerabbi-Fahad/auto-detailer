import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getBusiness } from "@/lib/personalize";

export const runtime = "nodejs";

let fonts;
async function loadFonts() {
  if (!fonts) {
    const dir = join(process.cwd(), "src/fonts");
    const [bold, light] = await Promise.all([
      readFile(join(dir, "ClashDisplay-Bold.ttf")),
      readFile(join(dir, "ClashDisplay-Light.ttf")),
    ]);
    fonts = [
      { name: "Clash", data: bold, weight: 700, style: "normal" },
      { name: "Clash", data: light, weight: 300, style: "normal" },
    ];
  }
  return fonts;
}

export async function GET(request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const biz = getBusiness(params);
  const accent = `#${biz.accent}`;
  const len = biz.name.length;
  const size = len <= 14 ? 132 : len <= 22 ? 104 : len <= 32 ? 82 : 64;
  const where = biz.hasCity ? biz.cityState : "your area";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0B0C0E",
          backgroundImage: `radial-gradient(900px 500px at 100% 0%, ${accent}55, transparent 70%), linear-gradient(180deg, #0B0C0E 0%, #16181C 100%)`,
          color: "#EDEEEA",
          fontFamily: "Clash",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#9A9EA6", letterSpacing: 4 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: accent }} />
          MOBILE DETAILING
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: size, fontWeight: 700, lineHeight: 0.98, letterSpacing: -Math.round(size * 0.02), maxWidth: 1040 }}>
            {biz.name}
          </div>
          <div style={{ width: 160, height: 8, background: accent, borderRadius: 4, margin: "40px 0 32px" }} />
          <div style={{ fontSize: 48, fontWeight: 300, color: "#EDEEEA" }}>{`Mobile detailing in ${where}`}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#9A9EA6" }}>
          <span>Showroom shine, in your driveway.</span>
          <span style={{ color: accent }}>Book in under a minute</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: await loadFonts(),
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
    },
  );
}
