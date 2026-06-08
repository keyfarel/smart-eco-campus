import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. Tambahkan import ini (Pastikan path-nya sesuai dengan letak file Providers kamu)
import { Providers } from "@/components/providers/providers";
import { GlobalAICamera } from "@/components/global-ai-camera";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoCampus Admin", // Boleh diganti sesuai nama projectmu
  description: "Smart Eco-Campus Efficiency System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 2. Bungkus children dengan komponen Providers */}
        <Providers>
          {children}
          <GlobalAICamera />
        </Providers>
      </body>
    </html>
  );
}