import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://healwithindia.vercel.app"),

  title: {
    default: "HealWithIndia | Medical Tourism & Healthcare Concierge",
    template: "%s | HealWithIndia",
  },

  description:
    "Connect with India's leading hospitals, experienced doctors and affordable treatment options. Medical tourism, treatment planning, hospital selection, visa assistance and patient support.",

  keywords: [
    "Medical Tourism India",
    "Treatment in India",
    "Healthcare Concierge",
    "Medical Travel",
    "Apollo Hospitals",
    "Fortis Healthcare",
    "Medanta",
    "Cancer Treatment India",
    "Heart Surgery India",
    "IVF India",
    "Orthopedic Surgery India",
    "Kidney Transplant India",
  ],

  authors: [
    {
      name: "HealWithIndia",
    },
  ],

  creator: "HealWithIndia",

  publisher: "HealWithIndia",

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
    title:
      "HealWithIndia | Medical Tourism & Healthcare Concierge",

    description:
      "Access India's leading hospitals and save up to 90% on treatment costs with complete medical travel support.",

    url: "https://healwithindia.vercel.app",

    siteName: "HealWithIndia",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/images/hero-doctor.png",
        width: 1200,
        height: 630,
        alt: "HealWithIndia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "HealWithIndia | Medical Tourism & Healthcare Concierge",

    description:
      "World-class healthcare in India with up to 90% cost savings.",

    images: ["/images/hero-doctor.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className="bg-black text-white">

        {children}

      </body>

    </html>
  );
}