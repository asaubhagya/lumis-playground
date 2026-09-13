import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumi’s Playground — An interactive classroom",
  description: "An immersive science classroom. Explore light, shadows, forces and motion with Lumi.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
