import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: ["400", "500", "700"]
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "AI Tools — Умные ИИ инструменты для работы",
  description: "Генерируй тексты, анализируй информацию, создавай контент за секунды с помощью искусственного интеллекта. Попробуй бесплатно!",
  keywords: "ИИ инструменты, искусственный интеллект, генерация текста, AI, нейросеть, автоматизация",
  authors: [{ name: "AI Tools" }],
  creator: "AI Tools",
  publisher: "AI Tools",
  robots: "index, follow",
  manifest: "/manifest.json",
  themeColor: "#7c3aed",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AI Tools"
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png"
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://www.iapro.ru",
    siteName: "AI Tools",
    title: "AI Tools — Умные ИИ инструменты для работы",
    description: "Генерируй тексты, анализируй информацию, создавай контент за секунды. Попробуй бесплатно!",
    images: [
      {
        url: "https://www.iapro.ru/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Tools",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools — Умные ИИ инструменты для работы",
    description: "Генерируй тексты, анализируй информацию, создавай контент за секунды.",
    images: ["https://www.iapro.ru/og-image.png"],
  },
  alternates: {
    canonical: "https://www.iapro.ru",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AI Tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="yandex-verification" content="ВАШ_КОД_ЯНДЕКСА" />
        <meta name="google-site-verification" content="ВАШ_КОД_ГУГЛА" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="canonical" href="https://www.iapro.ru" />
      </head>
      <body className="bg-zinc-950 font-[var(--font-body)] antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
