import React from 'react';
import Link from 'next/link';
import { getPublishedPosts } from '@/app/actions/blogActions';
import { FiPlay, FiFolder, FiArrowRight } from 'react-icons/fi';

export const revalidate = 0;

export default async function BlogsPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-800 shadow-sm">
          Media &amp; Publications
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold font-serif text-zinc-950 dark:text-white tracking-tight">
          Articles, Videos &amp; Slide Folders
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base">
          Browse the complete collection of insights, video embeds, and image slide galleries published by Durga Prasad Satapathy.
        </p>
      </div>

      {/* Grid of Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl border border-zinc-200 dark:border-zinc-900 text-zinc-500">
          No articles published yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Media Thumbnail */}
                <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative">
                  <img
                    src={
                      post.thumbnailUrl ||
                      (post.images && post.images[0]) ||
                      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Media Type Badge */}
                  <div className="absolute top-3 right-3 flex gap-1">
                    {post.youtubeUrl && (
                      <div className="px-2.5 py-1 bg-black/80 rounded-full text-white text-[10px] font-mono flex items-center gap-1 backdrop-blur-md border border-white/20">
                        <FiPlay className="w-3 h-3 text-white" />
                        <span>Video</span>
                      </div>
                    )}
                    {post.images && post.images.length > 0 && (
                      <div className="px-2.5 py-1 bg-black/80 rounded-full text-white text-[10px] font-mono flex items-center gap-1 backdrop-blur-md border border-white/20">
                        <FiFolder className="w-3 h-3 text-white" />
                        <span>{post.images.length} Slides</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <span className="text-[11px] font-mono text-zinc-500 block">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

                <h3 className="text-xl font-bold text-zinc-950 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors border-t border-zinc-200 dark:border-zinc-900 mt-4">
                <span>View Full Article</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
