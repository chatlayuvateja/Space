import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { LazyMotion, domAnimation } from "framer-motion";
import { LaunchProvider } from "@/contexts/LaunchesContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "COSMOS — Real-Time Space Intelligence",
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
    "cosmos",
  ],
  openGraph: {
    title: "COSMOS — Real-Time Space Intelligence",
    description:
      "Real-time ISS tracking, upcoming launches, NASA APOD, and space news.",
    type: "website",
    siteName: "COSMOS",
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
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary font-sans">
        <LazyMotion features={domAnimation}>
          <LaunchProvider>
            {children}
          </LaunchProvider>
        </LazyMotion>
      </body>
    </html>
  );
}
