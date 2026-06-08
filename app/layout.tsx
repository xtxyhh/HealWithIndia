import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealWithIndia",
  description: "International Healthcare Concierge",
  icons: {
    icon: "/icon.png",
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