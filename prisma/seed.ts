import { PrismaClient } from '@prisma/client';
import { seedCategory } from './seeds/category';
import { seedContentType } from './seeds/content-type';
import { seedOrganization } from './seeds/organization';
import { seedUser } from './seeds/user';
import { seedCourse } from './seeds/course';
import { deleteAll } from './seeds/delete';
import { seedLesson } from './seeds/lesson';
import { seedCourseContent } from './seeds/course-content';
const prisma = new PrismaClient();

async function main() {
    await deleteAll(prisma);

    await seedOrganization(prisma);
    await Promise.all([seedCategory(prisma), seedUser(prisma)]);
    await seedCourse(prisma);
    await Promise.all([seedContentType(prisma), seedLesson(prisma)]);
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
