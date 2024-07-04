import { PrismaClient } from '@prisma/client';

import { seedCategory } from './seeds/category';
import { seedCourse } from './seeds/course';
import { seedCourseContent } from './seeds/course-content';
import { deleteAll } from './seeds/delete';
import { seedLesson } from './seeds/lesson';
import { seedOrganization } from './seeds/organization';
import { seedSiteSettings } from './seeds/site-setting';
import { seedUser } from './seeds/user';
const prisma = new PrismaClient();

async function main() {
    await deleteAll(prisma);
    await seedSiteSettings(prisma);
    await seedOrganization(prisma);
    await Promise.all([seedCategory(prisma), seedUser(prisma)]);
    await seedCourse(prisma);
    await seedLesson(prisma);
    await seedCourseContent(prisma);
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
