import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "KenalanUMKM — Papan Persaingan UMKM Indonesia",
  description: "Satu juara dari setiap kabupaten/kota bersaing di leaderboard UMKM Indonesia berdasarkan stake terkonfirmasi.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="id"><body>{children}</body></html>;
}
