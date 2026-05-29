import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpaceExplore — Explore the Cosmos",
  description:
    "Track the International Space Station in real-time, discover upcoming rocket launches, explore NASA's Astronomy Picture of the Day, and stay informed with the latest space news.",
  keywords: [
    "space",
    "ISS tracker",
    "NASA",
    "SpaceX",
    "space launches",
    "astronomy",
    "APOD",
  ],
  openGraph: {
    title: "SpaceExplore — Explore the Cosmos",
    description:
      "Real-time ISS tracking, upcoming launches, NASA APOD, and space news.",
    type: "website",
    siteName: "SpaceExplore",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-space-950 text-space-100 font-sans">
        {children}
      </body>
    </html>
  );
}
