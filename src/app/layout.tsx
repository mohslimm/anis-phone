import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
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
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Anis Phone | Haute Téléphonie & Tech d'Exception",
  description: "Boutique de smartphones et haute technologie en Algérie. Neuf scellé et occasions d'exception certifiées. Livraison express 58 Wilayas.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#060610",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${outfit.variable} ${cormorant.variable} ${jetbrainsMono.variable} h-full antialiased selection:bg-[#c5a059]/20 selection:text-[#c5a059]`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-luxury-offwhite text-luxury-charcoal">
        <SmoothScrollProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
