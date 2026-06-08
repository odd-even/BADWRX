import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BADWRX | Badger Rifleworks",
    template: "%s | BADWRX",
  },
  description:
    "Precision rifles built to order by Badger Rifleworks (BADWRX). Hand test-fired before delivery with a ballistics table and rifle-specific ammunition data.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
