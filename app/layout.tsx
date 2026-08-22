import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { eventConfig, LUMA_REGISTRATION_URL } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#EAE0D0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Yuva Shakti Sangam | 6 September 2026 | Maninagar, Ahmedabad",
  description: "Yuva Shakti Sangam (युवा शक्ति • राष्ट्र शक्ति) — A dynamic youth gathering in Maninagar, Ahmedabad featuring on-ground games, live drama, open Samvaad dialogue, and nation-building initiatives.",
  keywords: [
    "Yuva Shakti Sangam",
    "Youth Event Ahmedabad",
    "Maninagar Event",
    "6 September 2026",
    "RSS Youth Gathering",
    "Yuva Samvaad",
    "Nation Building",
    "Youth Culture India",
    "Gujarat Youth Conference"
  ],
  authors: [{ name: "Yuva Shakti Sangam" }],
  creator: "Yuva Shakti Sangam",
  publisher: eventConfig.host,
  metadataBase: new URL(eventConfig.siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Yuva Shakti Sangam | युवा शक्ति • राष्ट्र शक्ति",
    description: "Where the energy of youth meets the responsibility of nation-building. 6 September 2026 at Maninagar, Ahmedabad. Register via Luma.",
    url: eventConfig.siteUrl,
    siteName: "Yuva Shakti Sangam",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yuva Shakti Sangam — 6 Sept 2026 • Ahmedabad",
    description: "Where the energy of youth meets the responsibility of nation-building. On-ground games, drama, Samvaad & nation-building.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Event JSON-LD
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Yuva Shakti Sangam (युवा शक्ति • राष्ट्र शक्ति)",
    "description": "A youth-focused gathering featuring on-ground games, cultural drama, open dialogue (Samvaad), and nation-building workshops.",
    "startDate": eventConfig.targetIsoDate,
    "endDate": eventConfig.endIsoDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Maninagar Venue",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Maninagar",
        "addressRegion": "Ahmedabad",
        "addressCountry": "IN"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": eventConfig.host,
      "url": eventConfig.siteUrl
    },
    "offers": {
      "@type": "Offer",
      "url": LUMA_REGISTRATION_URL,
      "price": "50",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${notoDevanagari.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
        />
      </head>
      <body className="bg-[#EAE0D0] text-[#1C1917] antialiased selection:bg-[#E65100] selection:text-white">
        {children}
      </body>
    </html>
  );
}
