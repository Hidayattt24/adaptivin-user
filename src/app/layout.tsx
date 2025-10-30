import type { Metadata } from "next";
import { Poppins, Montserrat, Press_Start_2P } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adaptivin - Sistem AI Pembelajaran Matematika SD",
  description:
    "Sistem AI Berbasis Web untuk Identifikasi Kesulitan dan Rekomendasi Belajar Matematika Siswa SD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} ${montserrat.variable} ${pressStart2P.variable}`}>
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
