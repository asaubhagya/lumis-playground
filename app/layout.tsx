import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Miss Lumi’s Classroom — Learn through curiosity",
  description: "A live AI teacher for curious minds ages 8–12. Ask any question, explore illustrated explanations, and discover science and maths through interactive experiments.",
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
