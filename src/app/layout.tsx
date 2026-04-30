import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Generador de Diplomas | Multiescuela",
  description:
    "Genera diplomas personalizados automáticamente para múltiples escuelas. Sube un Excel con los datos de tus alumnos y descarga los diplomas en PDF.",
  keywords: ["diplomas", "generador", "escuela", "PDF", "certificados", "educación"],
  authors: [{ name: "Diploma Generator" }],
  openGraph: {
    title: "Generador de Diplomas Multiescuela",
    description: "Genera diplomas PDF personalizados por escuela de forma automática",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gradient-animated">
        {children}
      </body>
    </html>
  );
}
