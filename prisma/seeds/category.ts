import type { PrismaClient } from '@prisma/client';

export async function seedCategory(client: PrismaClient) {
    await client.category.createMany({
        data: [
            {
                img_href: 'images/book-open.svg',
                title: 'Bible Study & Theology'
            },
            {
                img_href: 'images/biblical-languages.svg',
                title: 'Biblical Languages'
            },
            {
                img_href: 'images/shield-check.svg',
                title: 'Apologetics'
            },
            {
                img_href: 'images/user-group.svg',
                title: 'Leadership & Ministry'
            },
            {
                img_href: 'images/scale.svg',
                title: 'Worldview & Philosophy'
            },
            {
                img_href: 'images/heart.svg',
                title: 'Christian Counseling & Psychology'
            },
            {
                img_href: 'images/globe-africa.svg',
                title: 'Evangelism'
            },
            {
                img_href: 'images/musical-note.svg',
                title: 'Worship & Music'
            },
            {
                img_href: 'images/gift.svg',
                title: 'Ministry & Service'
            }
        ]
    });
}
