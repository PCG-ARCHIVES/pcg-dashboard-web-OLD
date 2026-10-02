import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Space Grotesk - Bold geometric headlines (similar to Clash Display)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-clash",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Inter - Clean modern body text (similar to Satoshi)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-satoshi",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vibertas.com"),
  title: {
    default: "Vibertas - Own Your Digital Life",
    template: "%s | Vibertas",
  },
  description: "Vibertas is a NixOS-based node operating system for the Sovereign Stack. In development and not yet released.",
  keywords: ["vibertas", "sovereign stack", "privacy os", "mesh network", "pcg dashboard", "alpha protocol", "omega", "vibe token", "pythia ai", "powerclub global"],
  openGraph: {
    title: "Vibertas - Own Your Digital Life",
    description: "Vibertas is a NixOS-based node operating system for the Sovereign Stack. In development and not yet released.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Vibertas | Own Your Digital Life" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibertas - Own Your Digital Life",
    description: "Vibertas is a NixOS-based node operating system for the Sovereign Stack. In development and not yet released.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
