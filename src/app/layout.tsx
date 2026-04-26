import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Station 11 — Caribbean-Asian Fusion | Midtown Atlanta",
  description:
    "Where East meets West Indies. Caribbean-Asian fusion restaurant and cafe in a historic 1907 firehouse. Midtown Atlanta.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
