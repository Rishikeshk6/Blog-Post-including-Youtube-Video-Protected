'useMeasurable';
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(formData: FormData) {
  try {
    const email = formData.get('email')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    if (!email || !message) {
      return { success: false, error: 'Email and message are required.' };
    }

    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const savedMessage = await prisma.contactMessage.create({
      data: {
        email,
        message,
      },
    });

    revalidatePath('/admin');
    return { success: true, message: 'Your message has been received successfully.' };
  } catch (error: any) {
    console.error('Failed to submit contact message:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function getContactMessages() {
  try {
    return await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch contact messages:', error);
    return [];
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await prisma.contactMessage.delete({
      where: { id },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete message' };
  }
}
