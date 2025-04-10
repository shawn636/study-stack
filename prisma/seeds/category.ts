import type { PrismaClient } from '@prisma/client';

export async function seedCategory(client: PrismaClient) {
    await client.category.createMany({
        data: [
            {
                imgHref: 'images/book-open.svg',
                recordType: 'SEED_RECORD',
                title: 'Reading & Research' // or "Learning Foundations"
            },
            {
                imgHref: 'images/biblical-languages.svg',
                recordType: 'SEED_RECORD',
                title: 'Language & Communication'
            },
            {
                imgHref: 'images/shield-check.svg',
                recordType: 'SEED_RECORD',
                title: 'Critical Thinking & Ethics'
            },
            {
                imgHref: 'images/user-group.svg',
                recordType: 'SEED_RECORD',
                title: 'Leadership & Teamwork'
            },
            {
                imgHref: 'images/scale.svg',
                recordType: 'SEED_RECORD',
                title: 'Philosophy & Debate' // or "Ethics & Society"
            },
            {
                imgHref: 'images/heart.svg',
                recordType: 'SEED_RECORD',
                title: 'Mental Health & Well-being'
            },
            {
                imgHref: 'images/globe-africa.svg',
                recordType: 'SEED_RECORD',
                title: 'Global Cultures & Communication'
            },
            {
                imgHref: 'images/musical-note.svg',
                recordType: 'SEED_RECORD',
                title: 'Music & Creative Arts'
            },
            {
                imgHref: 'images/gift.svg',
                recordType: 'SEED_RECORD',
                title: 'Community & Collaboration'
            }
        ]
    });
}
