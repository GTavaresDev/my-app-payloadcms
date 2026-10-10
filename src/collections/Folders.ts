import type { CollectionConfig } from 'payload'

export const Folders: CollectionConfig = {
    slug: 'folders',
    labels: {
        singular: 'Pasta',
        plural: 'Pastas',
    },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'slug'],
        group: 'Coleções',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            label: 'Nome da pasta',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            label: 'Identificador',
            type: 'text',
            required: true,
            unique: true
        }
    ]
}
