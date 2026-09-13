import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pip’s Playground — Little experiments. Big discoveries.",
  description: "Join Pip’s robot workshop. Move lights, make shadows, and discover the science through play.",
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
