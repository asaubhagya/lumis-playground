import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aha! — Your little science lab",
  description: "Make a prediction. Try an experiment. Discover the science in ten minutes.",
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
