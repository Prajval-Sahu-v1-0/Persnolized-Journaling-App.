import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import StatusBar from "./components/StatusBar";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oden's Journal",
  description: "A terminal-themed digital journal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${shareTechMono.variable} h-full antialiased`}>
      <body>
        {/* Background layers */}
        <div className="bg-layer" />
        <div className="bg-overlay" />

        {/* App shell */}
        <div className="app-shell">
          <Navbar />
          <div className="terminal-viewport">{children}</div>
          <StatusBar />
        </div>

        <div className="scanlines" />
      </body>
    </html>
  );
}
