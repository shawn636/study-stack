import type { PrismaClient } from '@prisma/client';

export async function seedCategory(client: PrismaClient) {
    await client.category.createMany({
        data: [
            {
                categoryImgHref: 'images/book-open.svg',
                categoryRecordType: 'SEED_RECORD',
                categoryTitle: 'Bible Study & Theology'
            },
            {
                categoryImgHref: 'images/biblical-languages.svg',
                categoryRecordType: 'SEED_RECORD',
                categoryTitle: 'Biblical Languages'
            },
            {
                categoryImgHref: 'images/shield-check.svg',
                categoryRecordType: 'SEED_RECORD',
                categoryTitle: 'Apologetics'
            },
            {
                categoryImgHref: 'images/user-group.svg',
                categoryRecordType: 'SEED_RECORD',
                categoryTitle: 'Leadership & Ministry'
            },
            {
                categoryImgHref: 'images/scale.svg',
                categoryRecordType: 'SEED_RECORD',
                categoryTitle: 'Worldview & Philosophy'
            },
            {
                categoryImgHref: 'images/heart.svg',
                categoryRecordType: 'SEED_RECORD',
                categoryTitle: 'Christian Counseling & Psychology'
            },
            {
                categoryImgHref: 'images/globe-africa.svg',
                categoryRecordType: 'SEED_RECORD',
                categoryTitle: 'Evangelism'
            },
            {
                categoryImgHref: 'images/musical-note.svg',
                categoryRecordType: 'SEED_RECORD',
                categoryTitle: 'Worship & Music'
            },
            {
                categoryImgHref: 'images/gift.svg',
                categoryRecordType: 'SEED_RECORD',
                categoryTitle: 'Ministry & Service'
            }
        ]
    });
}
