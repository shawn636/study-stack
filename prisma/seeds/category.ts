import type { PrismaClient } from '@prisma/client';

export async function seedCategory(client: PrismaClient) {
    await client.category.createMany({
        data: [
            {
                imgHref: 'images/book-open.svg',
                title: 'Bible Study & Theology'
            },
            {
                imgHref: 'images/biblical-languages.svg',
                title: 'Biblical Languages'
            },
            {
                imgHref: 'images/shield-check.svg',
                title: 'Apologetics'
            },
            {
                imgHref: 'images/user-group.svg',
                title: 'Leadership & Ministry'
            },
            {
                imgHref: 'images/scale.svg',
                title: 'Worldview & Philosophy'
            },
            {
                imgHref: 'images/heart.svg',
                title: 'Christian Counseling & Psychology'
            },
            {
                imgHref: 'images/globe-africa.svg',
                title: 'Evangelism'
            },
            {
                imgHref: 'images/musical-note.svg',
                title: 'Worship & Music'
            },
            {
                imgHref: 'images/gift.svg',
                title: 'Ministry & Service'
            }
        ]
    });
}
