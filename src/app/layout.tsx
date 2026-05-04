import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Generador de Fichas de Practicas | Multiescuela",
  description:
    "Genera fichas de practicas automaticamente para multiples escuelas. Sube un Excel con los datos y descarga los PDF.",
  keywords: ["fichas", "practicas", "generador", "escuela", "PDF", "educacion"],
  authors: [{ name: "Ficha Generator" }],
  openGraph: {
    title: "Generador de Fichas de Practicas Multiescuela",
    description: "Genera fichas PDF personalizadas por escuela de forma automatica",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${manrope.variable} ${sora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gradient-animated">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
