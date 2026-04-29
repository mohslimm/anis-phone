import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import { PageTransition } from "@/components/providers/page-transition";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anis Phone | Boutique Premium Smartphones",
  description: "Boutique de smartphones et accessoires premium en Algérie. Livraison 58 Wilayas.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${outfit.variable} h-full antialiased selection:bg-black/10`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <SmoothScrollProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
