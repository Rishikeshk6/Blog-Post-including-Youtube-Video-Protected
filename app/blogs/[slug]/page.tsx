import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/app/actions/blogActions';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { ImageCarousel } from '@/components/ImageCarousel';
import { FiArrowLeft, FiCalendar, FiExternalLink } from 'react-icons/fi';

interface SinglePostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export default async function SinglePostPage({ params }: SinglePostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n\n');
    return lines.map((paragraph, index) => {
      const parts = paragraph.split(/(\[[^\]]+\]\([^)]+\))/g);
      return (
        <p key={index} className="text-zinc-700 dark:text-zinc-300 text-base md:text-lg leading-relaxed mb-6 font-light">
          {parts.map((part, pIdx) => {
            const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            if (match) {
              return (
                <a
                  key={pIdx}
                  href={match[2]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black dark:text-white underline decoration-zinc-400 dark:decoration-zinc-500 hover:decoration-black dark:hover:decoration-white font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <span>{match[1]}</span>
                  <FiExternalLink className="w-3.5 h-3.5 inline" />
                </a>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors border border-zinc-300 dark:border-zinc-800 px-4 py-2 rounded-full bg-zinc-50 dark:bg-zinc-950 shadow-sm"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>

      {/* Header Info */}
      <header className="space-y-4 border-b border-zinc-200 dark:border-zinc-900 pb-8">
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
          <FiCalendar className="w-4 h-4" />
          <span>
            Published on{' '}
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold font-serif text-zinc-950 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-light leading-relaxed border-l-2 border-zinc-400 dark:border-zinc-700 pl-4 py-1 italic">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* Synchronized YouTube Video Player */}
      {post.youtubeUrl && (
        <section className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Embedded Video Feature
          </h2>
          <YouTubeEmbed videoUrl={post.youtubeUrl} title={post.title} />
        </section>
      )}

      {/* Picture Slide Folder */}
      {post.images && post.images.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Picture Slide Folder ({post.images.length} Photos)
          </h2>
          <ImageCarousel images={post.images} title={`${post.title} - Photo Gallery`} />
        </section>
      )}

      {/* Main Text Content */}
      <div className="prose prose-zinc dark:prose-invert max-w-none pt-4 border-t border-zinc-200 dark:border-zinc-900">
        {renderFormattedContent(post.content)}
      </div>

      {/* Footer Article Tag */}
      <footer className="pt-8 border-t border-zinc-200 dark:border-zinc-900 flex items-center justify-between text-xs text-zinc-500">
        <span>Author: Durga Prasad Satapathy</span>
        <span className="font-mono">ID: {post.slug}</span>
      </footer>
    </article>
  );
}
