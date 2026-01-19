import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather AI Chatbot",
  description: "Voice-enabled weather assistant with premium design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0 }}>
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
