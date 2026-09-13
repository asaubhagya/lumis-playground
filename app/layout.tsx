import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumi’s Playground — An interactive classroom",
  description: "A classroom for tiny curious minds. Explore light and shadows with Miss Lumi in an interactive science playground for ages 5–7.",
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
