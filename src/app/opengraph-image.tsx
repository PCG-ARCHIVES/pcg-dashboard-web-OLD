import { ImageResponse } from "next/og";

export const alt = "Vibertas | Own Your Digital Life";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, background: "#050810", color: "#f5f5f5" }}>
        <div style={{ fontSize: 96, fontWeight: 800, color: "#eab308" }}>Vibertas</div>
        <div style={{ fontSize: 52, marginTop: 24, color: "#f5f5f5" }}>Own Your Digital Life</div>
        <div style={{ fontSize: 30, marginTop: 28, color: "#b9c0cf", maxWidth: 1000 }}>A node operating system for the Sovereign Stack. In development and not yet released.</div>
        <div style={{ fontSize: 26, marginTop: 56, color: "#eab308" }}>vibertas.com</div>
      </div>
    ),
    size,
  );
}
