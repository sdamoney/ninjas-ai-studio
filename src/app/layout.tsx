import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "91Ninjas AI Studio — Professional Headshot Generator",
  description:
    "Transform any selfie into a polished, professional headshot using cutting-edge AI technology. Powered by 91Ninjas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0a0a12] text-white font-[family-name:var(--font-inter)]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
