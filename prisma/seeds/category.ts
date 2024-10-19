import type { PrismaClient } from '@prisma/client';

export async function seedCategory(client: PrismaClient) {
    await client.category.createMany({
        data: [
            {
                imgHref: 'images/book-open.svg',
                recordType: 'SEED_RECORD',
                title: 'Bible Study & Theology'
            },
            {
                imgHref: 'images/biblical-languages.svg',
                recordType: 'SEED_RECORD',
                title: 'Biblical Languages'
            },
            {
                imgHref: 'images/shield-check.svg',
                recordType: 'SEED_RECORD',
                title: 'Apologetics'
            },
            {
                imgHref: 'images/user-group.svg',
                recordType: 'SEED_RECORD',
                title: 'Leadership & Ministry'
            },
            {
                imgHref: 'images/scale.svg',
                recordType: 'SEED_RECORD',
                title: 'Worldview & Philosophy'
            },
            {
                imgHref: 'images/heart.svg',
                recordType: 'SEED_RECORD',
                title: 'Christian Counseling & Psychology'
            },
            {
                imgHref: 'images/globe-africa.svg',
                recordType: 'SEED_RECORD',
                title: 'Evangelism'
            },
            {
                imgHref: 'images/musical-note.svg',
                recordType: 'SEED_RECORD',
                title: 'Worship & Music'
            },
            {
                imgHref: 'images/gift.svg',
                recordType: 'SEED_RECORD',
                title: 'Ministry & Service'
            }
        ]
    });
}
