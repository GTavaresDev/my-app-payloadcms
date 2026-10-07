import React from 'react'
import { Hero } from './_components/Hero'
import { getMedia } from '@/lib/payload'

export default async function HomePage() {
  const media = await getMedia()
  const logo = media?.[0]

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] justify-center items-center">
      <Hero logoUrl={logo?.url} logoAlt={logo?.alt} />
    </div>
  )
}
