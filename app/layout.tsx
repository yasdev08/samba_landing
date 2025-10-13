import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google"
import "./globals.css";
import type React from "react";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import FacebookPixel from "./components/fbpixel";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Chaussura - Adidas Samba",
  description: "Commandez vos Adidas Samba à petit prix en Algérie 🇩🇿",
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <FacebookPixel/>
        {children}
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}
