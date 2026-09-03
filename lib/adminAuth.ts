import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function checkIsAdmin(): Promise<{ isAdmin: boolean; email?: string; user?: any }> {
  try {
    const user = await currentUser();
    if (!user) return { isAdmin: false };

    const email = user.emailAddresses[0]?.emailAddress?.toLowerCase().trim();
    if (!email) return { isAdmin: false };

    // Query Neon PostgreSQL AdminUser table
    const adminRecord = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (adminRecord) {
      return { isAdmin: true, email, user };
    }

    return { isAdmin: false, email, user };
  } catch (error) {
    console.error('Error checking admin status in database:', error);
    return { isAdmin: false };
  }
}
