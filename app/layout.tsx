import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMU Event Compass",
  description: "Discover events across CMU in one unified interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased">{children}</body>
    </html>
  );
}

