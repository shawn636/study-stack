import type { PrismaClient } from '@prisma/client';

export async function seedCategory(client: PrismaClient) {
    await client.category.createMany({
        data: [
            {
                categoryImgHref: 'images/book-open.svg',
                categoryTitle: 'Bible Study & Theology'
            },
            {
                categoryImgHref: 'images/biblical-languages.svg',
                categoryTitle: 'Biblical Languages'
            },
            {
                categoryImgHref: 'images/shield-check.svg',
                categoryTitle: 'Apologetics'
            },
            {
                categoryImgHref: 'images/user-group.svg',
                categoryTitle: 'Leadership & Ministry'
            },
            {
                categoryImgHref: 'images/scale.svg',
                categoryTitle: 'Worldview & Philosophy'
            },
            {
                categoryImgHref: 'images/heart.svg',
                categoryTitle: 'Christian Counseling & Psychology'
            },
            {
                categoryImgHref: 'images/globe-africa.svg',
                categoryTitle: 'Evangelism'
            },
            {
                categoryImgHref: 'images/musical-note.svg',
                categoryTitle: 'Worship & Music'
            },
            {
                categoryImgHref: 'images/gift.svg',
                categoryTitle: 'Ministry & Service'
            }
        ]
    });
}
