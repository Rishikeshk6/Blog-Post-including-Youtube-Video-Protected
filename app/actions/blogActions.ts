'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getPublishedPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }
}

export async function getAllPosts() {
  try {
    return await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

export async function createBlogPost(formData: FormData) {
  try {
    const title = formData.get('title')?.toString().trim();
    const excerpt = formData.get('excerpt')?.toString().trim() || '';
    const content = formData.get('content')?.toString().trim() || '';
    const thumbnailUrl = formData.get('thumbnailUrl')?.toString().trim() || null;
    const youtubeUrl = formData.get('youtubeUrl')?.toString().trim() || null;
    const imagesRaw = formData.get('images')?.toString().trim() || '';

    if (!title) {
      return { success: false, error: 'Title is required.' };
    }

    // Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    if (!baseSlug) baseSlug = `post-${Date.now()}`;
    
    const slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;

    const images = imagesRaw
      ? imagesRaw.split(',').map((img) => img.trim()).filter(Boolean)
      : [];

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        thumbnailUrl,
        youtubeUrl,
        images,
        published: true,
      },
    });

    revalidatePath('/');
    revalidatePath('/blogs');
    revalidatePath('/admin');

    return { success: true, post: newPost };
  } catch (error: any) {
    console.error('Failed to create post:', error);
    return { success: false, error: error.message || 'Failed to create blog post' };
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  try {
    const title = formData.get('title')?.toString().trim();
    const excerpt = formData.get('excerpt')?.toString().trim() || '';
    const content = formData.get('content')?.toString().trim() || '';
    const thumbnailUrl = formData.get('thumbnailUrl')?.toString().trim() || null;
    const youtubeUrl = formData.get('youtubeUrl')?.toString().trim() || null;
    const imagesRaw = formData.get('images')?.toString().trim() || '';
    const published = formData.get('published') === 'true';

    if (!title) {
      return { success: false, error: 'Title is required.' };
    }

    const images = imagesRaw
      ? imagesRaw.split(',').map((img) => img.trim()).filter(Boolean)
      : [];

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        thumbnailUrl,
        youtubeUrl,
        images,
        published,
      },
    });

    revalidatePath('/');
    revalidatePath('/blogs');
    revalidatePath(`/blogs/${updatedPost.slug}`);
    revalidatePath('/admin');

    return { success: true, post: updatedPost };
  } catch (error: any) {
    console.error('Failed to update post:', error);
    return { success: false, error: error.message || 'Failed to update post' };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath('/blogs');
    revalidatePath('/admin');

    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete post:', error);
    return { success: false, error: 'Failed to delete post' };
  }
}
