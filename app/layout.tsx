import type { ReactNode } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export const metadata = {
  title: "KenalanUMKM — Peta Kompetisi UMKM Indonesia",
  description: "Jelajahi peta UMKM Indonesia dan leaderboard berdasarkan Kabupaten/Kota dan kategori.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="id"><body>{children}</body></html>;
}
