import type { PrismaClient } from '@prisma/client';

export async function seedCategory(client: PrismaClient) {
    await client.category.createMany({
        data: [
            {
                title: 'Bible Study & Theology',
                img_href: 'images/book-open.svg'
            },
            {
                title: 'Biblical Languages',
                img_href: 'images/biblical-languages.svg'
            },
            {
                title: 'Apologetics',
                img_href: 'images/shield-check.svg'
            },
            {
                title: 'Leadership & Ministry',
                img_href: 'images/user-group.svg'
            },
            {
                title: 'Worldview & Philosophy',
                img_href: 'images/scale.svg'
            },
            {
                title: 'Christian Counseling & Psychology',
                img_href: 'images/heart.svg'
            },
            {
                title: 'Evangelism',
                img_href: 'images/globe-africa.svg'
            },
            {
                title: 'Worship & Music',
                img_href: 'images/musical-note.svg'
            },
            {
                title: 'Ministry & Service',
                img_href: 'images/gift.svg'
            }
        ]
    });
}
