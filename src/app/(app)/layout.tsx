import type { Metadata } from 'next'
import React from 'react'
import './globals.css'
import { Header } from './_components/Header'
import { Footer } from './_components/Footer'
import { getMedia } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Clube de Regatas do Flamengo | O Mais Querido',
  description: 'Landing Page oficial e portal demonstrativo do Clube de Regatas do Flamengo integrado ao Payload CMS.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const media = await getMedia();
  const logo = media?.[0]
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="min-h-screen bg-white text-zinc-900 flex flex-col antialiased selection:bg-red-600 selection:text-white">
        <Header logoUrl={logo?.url} logoAlt={logo?.alt} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
