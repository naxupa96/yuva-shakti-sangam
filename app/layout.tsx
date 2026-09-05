import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { eventConfig } from "@/lib/config";

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
  description: "Yuva Shakti Sangam (युવા શક્તિ • રાષ્ટ્ર શક્તિ) — Dynamic youth gathering in Maninagar, Ahmedabad with Chief Guest Rupesh Makwana (Guinness Record Holder) & Guest of Honor Nidhi Mehta (National Yoga Player). On-ground games, Samvaad dialogue & nation building.",
  keywords: [
    "Yuva Shakti Sangam",
    "Youth Event Ahmedabad",
    "Maninagar Event",
    "6 September 2026",
    "Rupesh Makwana",
    "Nidhi Mehta",
    "National Yoga Player",
    "Nidhi's Yoga Hub",
    "Guest of Honor",
    "Guinness World Record",
    "RSS Youth Gathering",
    "Yuva Samvaad",
    "Nation Building",
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
    description: "Where the energy of youth meets the responsibility of nation-building. 6 September 2026 at Maninagar, Ahmedabad. Register online for your official pass.",
    url: eventConfig.siteUrl,
    siteName: "Yuva Shakti Sangam",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yuva Shakti Sangam | युवा शक्ति • राष्ट्र शक्ति",
    description: "Join Gujarat's biggest youth gathering. 6 Sept 2026 at Maninagar, Ahmedabad.",
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
    "name": eventConfig.name,
    "description": eventConfig.taglineEnglish,
    "startDate": eventConfig.targetIsoDate,
    "endDate": eventConfig.endIsoDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": eventConfig.locationShort,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ahmedabad",
        "addressRegion": "Gujarat",
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
      "price": "50",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `${eventConfig.siteUrl}/register`,
      "validFrom": "2026-08-01T00:00:00+05:30"
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
