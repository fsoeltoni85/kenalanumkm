import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "KenalanUMKM — Jelajahi UMKM Indonesia",
  description: "Jelajahi UMKM Indonesia melalui peta dan leaderboard kota.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="id"><body>{children}</body></html>;
}
