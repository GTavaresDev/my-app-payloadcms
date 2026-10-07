import React from 'react'
import { getMedia } from '@/lib/payload'
import NotPhotos from './_components/NotPhotos'
import PhotosHeader from './_components/PhotosHeader'
import PhotosGrid from './_components/PhotosGrid'

export default async function HomePage() {
  const photos = await getMedia('fotos-do-clube')

  if (!photos || photos.length === 0) {
    return <NotPhotos />
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-zinc-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PhotosHeader />
        <PhotosGrid photos={photos} />
      </div>
    </div>
  )
}
