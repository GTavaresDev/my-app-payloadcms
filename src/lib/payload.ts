import config from '@/payload.config'
import { getPayload } from 'payload'


export async function getMedia() {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
        collection: 'media',
        limit: 100,
    })
    return docs
}
