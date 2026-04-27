import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Station 11 — Cafe & Restaurant | Midtown Atlanta",
  description:
    "Caribbean-Asian cafe in a 1907 firehouse. Breakfast, brunch, lunch & coffee. Midtown Atlanta. Reserve on Resy.",
  openGraph: {
    title: "Station 11 — Where East Meets West Indies",
    description:
      "Caribbean-Asian fusion in a historic Midtown firehouse. Brunch, lunch, coffee, cocktails. Reserve on Resy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
