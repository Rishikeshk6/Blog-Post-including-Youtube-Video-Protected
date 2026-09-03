import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database tables...');

  // Seed Admin User
  const adminEmail = 'anand.aisuite@gmail.com';
  const adminUser = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail },
  });

  console.log(`Admin user seeded: ${adminUser.email}`);

  // Seed initial sample blog posts if table is empty
  const existingPosts = await prisma.blogPost.count();
  if (existingPosts === 0) {
    const samplePosts = [
      {
        title: 'Architecting Next-Gen Web Applications & Digital Platforms',
        slug: 'architecting-next-gen-web-applications',
        excerpt:
          'A comprehensive exploration of high-performance microservices, modern front-end frameworks, and synchronized video media delivery.',
        content:
          'Building modern web platforms requires a meticulous balance between lightning-fast page loading, serverless database connectivity, and immersive media components.\n\nIn this publication, we dive deep into building scalable architectures with Next.js, Prisma ORM, and Neon PostgreSQL. You can learn more about official Next.js documentation at [Next.js Framework](https://nextjs.org) and database strategies at [Neon PostgreSQL](https://neon.tech).\n\nKey takeaways include optimizing media playback using iframe state broadcasting to prevent audio overlap, storing dynamic picture galleries efficiently, and enforcing security boundaries using Clerk authentication.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        images: [
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        ],
        published: true,
      },
      {
        title: 'Monochrome Design Aesthetics & Premium User Interfaces',
        slug: 'monochrome-design-aesthetics-and-ui',
        excerpt:
          'Why minimalist obsidian and silver high-contrast design creates an unforgettable luxury impression for digital experiences.',
        content:
          'Minimalist dark aesthetics rely on precise typography contrast, subtle glassmorphism elevation, and smooth motion transitions.\n\nBy leveraging framer-motion and tailored CSS variables, we craft interfaces that feel elevated, quiet, and profoundly clear. Explore modern design guidelines at [Google Material Design](https://material.io) and vector graphics at [React Icons](https://react-icons.github.io/react-icons/).\n\nRemoving visual noise and emojis allows key content—such as video lectures and photo collections—to shine without distraction.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        youtubeUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
        images: [
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        ],
        published: true,
      },
      {
        title: 'Building Synchronized Single-Active Media Players',
        slug: 'building-synchronized-single-active-media-players',
        excerpt:
          'How to implement browser event listeners and custom state handlers so only one video plays at a time across your web app.',
        content:
          'Multiple playing videos on a single web page create chaotic user experiences. Using the YouTube iFrame API along with custom event dispatching, we can coordinate video states effortlessly.\n\nWhen player A broadcasts a PLAYING state, all other registered instances trigger an automatic pause method. This guarantees pristine listening focus.\n\nFind out more about iframe APIs at [YouTube Developer Portal](https://developers.google.com/youtube/iframe_api_reference).',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        images: [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        ],
        published: true,
      },
    ];

    for (const post of samplePosts) {
      await prisma.blogPost.create({ data: post });
    }
  }

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
