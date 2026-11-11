import type React from "react"
import type { Metadata } from "next"
import { Cormorant, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { RevealOnScroll } from "@/components/reveal-on-scroll"
import "./globals.css"

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "CONVS Abogados Asociados | Estudio Jurídico",
  description: "Ofrecemos servicio jurídico integral, extrajudicial, judicial, de forma humana y empática.",
  generator: "v0.app",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${cormorant.variable} ${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <RevealOnScroll />
        <Analytics />
      </body>
    </html>
  )
}
