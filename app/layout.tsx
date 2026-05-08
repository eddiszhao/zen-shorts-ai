import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZenShorts AI - Create Your Zen Moment",
  description: "Generate 30-second faceless video scripts with AI-generated images",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
