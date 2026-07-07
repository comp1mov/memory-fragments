import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Memory Fragment Portal",
    template: "%s | Memory Fragment Portal"
  },
  description: "A gallery portal for Spatial Memory Fragments.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Memory Fragment Portal",
    description: "A gallery portal for Spatial Memory Fragments.",
    url: siteUrl,
    siteName: "Memory Fragment Portal",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Memory Fragment Portal",
    description: "A gallery portal for Spatial Memory Fragments."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
