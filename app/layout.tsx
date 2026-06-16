import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMU Event Compass",
  description: "A unified feed of CMU events across schools and calendars.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23A6192E'/><text x='16' y='22' font-size='16' fill='white' text-anchor='middle' font-family='sans-serif' font-weight='700'>EC</text></svg>",
  },
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
