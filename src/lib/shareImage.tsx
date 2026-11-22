import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { CSSProperties } from "react";
import { content } from "@/content";

export const shareImageSize = { width: 1200, height: 630 };

const HEBREW = /[\u0590-\u05FF]/;

/**
 * Satori (the engine behind next/og) lays text out left-to-right only, so
 * Hebrew comes out mirrored. Render each word as its own box in a
 * row-reverse flex line (right-to-left word order, wrapping from the right)
 * and reverse the letters of Hebrew words; Latin words like "CBT" keep theirs.
 */
function RtlText({ text, style }: { text: string; style: CSSProperties }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", flexWrap: "wrap", ...style }}>
      {words.map((word, i) => (
        <span key={i} style={{ marginLeft: i === words.length - 1 ? 0 : "0.28em" }}>
          {HEBREW.test(word) ? Array.from(word).reverse().join("") : word}
        </span>
      ))}
    </div>
  );
}

/** Favicon / Apple touch icon: the first letter of her name on sage. */
export async function renderIcon(size: number) {
  const bold = await readFile(join(process.cwd(), "src/assets/fonts/Heebo-Bold.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#34503a",
          color: "#fbf8f3",
          borderRadius: size > 64 ? 0 : size * 0.22,
          fontFamily: "Heebo",
          fontSize: size * 0.72,
          fontWeight: 700,
          lineHeight: 1,
          paddingBottom: size * 0.06,
        }}
      >
        {content.person.firstName.charAt(0)}
      </div>
    ),
    { width: size, height: size, fonts: [{ name: "Heebo", data: bold, weight: 700, style: "normal" }] },
  );
}

/**
 * The 1200×630 link-preview image (photo, name, title), rendered at build
 * time. This is what WhatsApp shows when the site's link is pasted.
 */
export async function renderShareImage() {
  const [regular, bold, photo] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/Heebo-Regular.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/Heebo-Bold.ttf")),
    readFile(join(process.cwd(), "public", content.person.photo.src)),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const { name, title, tagline } = content.site.shareImage;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          background: "linear-gradient(135deg, #eef2ea 0%, #fbf8f3 60%, #f4ede2 100%)",
          fontFamily: "Heebo",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
        <img
          src={photoSrc}
          width={420}
          height={420}
          alt=""
          style={{ borderRadius: 48, border: "10px solid #ffffff", boxShadow: "0 20px 50px rgba(36,56,40,0.18)" }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", width: 600 }}>
          <RtlText text={name} style={{ fontSize: 96, fontWeight: 700, color: "#243828", lineHeight: 1.1 }} />
          <RtlText text={title} style={{ fontSize: 52, fontWeight: 700, color: "#a4492a", marginTop: 18 }} />
          <div style={{ width: 120, height: 6, borderRadius: 3, background: "#557257", marginTop: 34 }} />
          <RtlText
            text={tagline}
            style={{ fontSize: 34, fontWeight: 400, color: "#2a2724", marginTop: 34, lineHeight: 1.4 }}
          />
        </div>
      </div>
    ),
    {
      ...shareImageSize,
      fonts: [
        { name: "Heebo", data: regular, weight: 400, style: "normal" },
        { name: "Heebo", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
