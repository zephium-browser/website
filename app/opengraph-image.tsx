import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fonts = join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans");

/** The card links share: the logo and the tagline, under the hero's sky. */
export default async function OpenGraphImage() {
  const [semibold, logo] = await Promise.all([
    readFile(join(fonts, "Geist-SemiBold.ttf")),
    readFile(join(process.cwd(), "public/brand/zephium-mark-128.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 76px",
          backgroundColor: "#5d9bd6",
          backgroundImage:
            "radial-gradient(60% 45% at 22% 92%, rgba(251,248,242,0.9), rgba(251,248,242,0) 70%), radial-gradient(50% 40% at 78% 98%, rgba(251,248,242,0.75), rgba(251,248,242,0) 70%), radial-gradient(40% 30% at 88% 8%, rgba(255,246,220,0.35), rgba(255,246,220,0) 70%), linear-gradient(#3876ba, #8cbfe8)",
          color: "#ffffff",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, fontWeight: 600 }}>
          <img src={logoSrc} width={48} height={48} alt="" style={{ borderRadius: 11 }} />
          Zephium
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 64, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.04 }}>
          <div style={{ display: "flex" }}>A browser-native work environment,</div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.78)" }}>rebuilt for you and your agents.</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: semibold, weight: 600, style: "normal" }] },
  );
}
