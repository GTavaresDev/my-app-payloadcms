import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getMedia(slug?: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'media',
      where: slug
        ? {
            'folder.slug': {
              equals: slug,
            },
          }
        : undefined,
      limit: 100,
    })
    return docs
  } catch (error) {
    console.error('Error fetching media from Payload:', error)
    return []
  }
}

export async function getNews() {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'news',
      depth: 1,
      limit: 100,
    })
    return docs
  } catch (error) {
    console.error('Error fetching news from Payload:', error)
    return []
  }
}

export async function getNewsById(title: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'news',
      depth: 1,
      where: {
        title: {
          equals: title,
        },
      },
      limit: 1,
    })
    return docs[0] || null
  } catch (error) {
    console.error(`Error fetching news with title "${title}" from Payload:`, error)
    return null
  }
}

