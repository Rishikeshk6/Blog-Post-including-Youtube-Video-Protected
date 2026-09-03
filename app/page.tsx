import React from 'react';
import Link from 'next/link';
import { getPublishedPosts } from '@/app/actions/blogActions';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { ImageCarousel } from '@/components/ImageCarousel';
import { ContactForm } from '@/components/ContactForm';
import { FiArrowRight, FiVideo, FiFolder, FiFileText, FiLayers, FiPlay } from 'react-icons/fi';

export const revalidate = 0;

export default async function HomePage() {
  const posts = await getPublishedPosts();

  const featuredPost = posts.find((p) => p.youtubeUrl || (p.images && p.images.length > 0)) || posts[0];
  const regularPosts = posts.filter((p) => p.id !== featuredPost?.id).slice(0, 4);

  return (
    <div className="w-full space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 px-4 md:px-8 border-b border-zinc-200 dark:border-zinc-900 subtle-grid overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-zinc-200/60 to-zinc-300/30 dark:from-zinc-800/20 dark:to-white/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/80 backdrop-blur-md text-xs font-mono uppercase tracking-widest text-black dark:text-zinc-400 shadow-sm font-extrabold">
            <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white animate-pulse" />
            <span>Welcome to the Official Hub</span>
          </div>

          {/* Main Website Name - High Saturation Pitch Black in Light Mode */}
          <h1 className="hero-title text-4xl sm:text-6xl md:text-7xl font-extrabold font-serif tracking-tight leading-tight">
            Durga Prasad Satapathy
          </h1>

          <p className="text-sub text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            Exploring technology, innovation, thought leadership, media insights, and curated digital stories through interactive embedded videos and picture slide galleries.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/blogs"
              className="px-8 py-4 rounded-xl bg-black text-white dark:bg-white dark:text-black font-extrabold uppercase text-xs tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xl flex items-center gap-3 group"
            >
              <span>Explore Blogs &amp; Media</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#contact"
              className="px-8 py-4 rounded-xl bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-800 text-black dark:text-zinc-300 font-extrabold uppercase text-xs tracking-wider hover:border-black dark:hover:border-zinc-500 transition-all flex items-center gap-3 shadow-md"
            >
              <span>Get In Touch</span>
            </a>
          </div>

          {/* Quick Feature Pillars */}
          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="glass-panel p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <FiVideo className="w-5 h-5 text-black dark:text-white mb-2" />
              <h3 className="text-xs uppercase font-extrabold text-black dark:text-white tracking-wider">
                Synchronized Video
              </h3>
              <p className="text-[11px] text-zinc-800 dark:text-zinc-400 font-medium mt-1">
                Single active YouTube player playback across entire site.
              </p>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <FiFolder className="w-5 h-5 text-black dark:text-white mb-2" />
              <h3 className="text-xs uppercase font-extrabold text-black dark:text-white tracking-wider">
                Slide Folders
              </h3>
              <p className="text-[11px] text-zinc-800 dark:text-zinc-400 font-medium mt-1">
                High-definition picture slideshows and full-screen preview.
              </p>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <FiFileText className="w-5 h-5 text-black dark:text-white mb-2" />
              <h3 className="text-xs uppercase font-extrabold text-black dark:text-white tracking-wider">
                Articles &amp; Links
              </h3>
              <p className="text-[11px] text-zinc-800 dark:text-zinc-400 font-medium mt-1">
                Structured rich text posts with embedded hyperlinks.
              </p>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <FiLayers className="w-5 h-5 text-black dark:text-white mb-2" />
              <h3 className="text-xs uppercase font-extrabold text-black dark:text-white tracking-wider">
                PostgreSQL DB
              </h3>
              <p className="text-[11px] text-zinc-800 dark:text-zinc-400 font-medium mt-1">
                Real-time content management with Clerk admin authorization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content & Media Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 dark:border-zinc-900 pb-6 gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-800 dark:text-zinc-500 font-bold">Spotlight</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-black dark:text-white tracking-tight mt-1">
              Featured Insights &amp; Media
            </h2>
          </div>
          <Link
            href="/blogs"
            className="text-xs font-extrabold uppercase tracking-wider text-black dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-white flex items-center gap-2 transition-colors"
          >
            <span>View All Posts ({posts.length})</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Post Card */}
        {featuredPost ? (
          <div className="glass-panel rounded-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-zinc-200 dark:border-zinc-800">
            {/* Left Media (YouTube player or Slide Folder) */}
            <div className="lg:col-span-7 space-y-4">
              {featuredPost.youtubeUrl ? (
                <YouTubeEmbed videoUrl={featuredPost.youtubeUrl} title={featuredPost.title} />
              ) : featuredPost.images && featuredPost.images.length > 0 ? (
                <ImageCarousel images={featuredPost.images} title={featuredPost.title} />
              ) : (
                <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <img
                    src={
                      featuredPost.thumbnailUrl ||
                      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
                    }
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Right Details */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-black text-white dark:bg-zinc-900 dark:text-zinc-300 font-extrabold border border-black dark:border-zinc-800">
                  Featured
                </span>
                <span className="text-xs text-zinc-700 dark:text-zinc-500 font-mono font-bold">
                  {new Date(featuredPost.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white tracking-tight leading-snug">
                {featuredPost.title}
              </h3>

              <p className="text-zinc-800 dark:text-zinc-400 text-sm leading-relaxed line-clamp-4 font-normal">
                {featuredPost.excerpt}
              </p>

              <div className="pt-2">
                <Link
                  href={`/blogs/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white bg-black dark:bg-zinc-900 dark:hover:bg-zinc-800 hover:bg-zinc-800 border border-black dark:border-zinc-700 px-5 py-3 rounded-lg transition-all shadow-md"
                >
                  <span>Read Full Post</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl border border-zinc-200 dark:border-zinc-900 text-zinc-800 font-medium">
            No posts published yet. Use the Admin Panel to create your first article!
          </div>
        )}

        {/* Regular Posts Grid */}
        {regularPosts.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="text-lg font-extrabold text-black dark:text-white uppercase tracking-wider border-l-2 border-black dark:border-white pl-3">
              Recent Articles &amp; Releases
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blogs/${post.slug}`}
                  className="glass-panel glass-panel-hover rounded-xl p-5 flex flex-col justify-between group border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="space-y-3">
                    <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-950 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800/80 relative">
                      <img
                        src={
                          post.thumbnailUrl ||
                          (post.images && post.images[0]) ||
                          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {post.youtubeUrl && (
                        <div className="absolute top-3 right-3 p-2 bg-black/80 rounded-full text-white backdrop-blur-sm border border-white/20">
                          <FiPlay className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-zinc-700 dark:text-zinc-500 font-mono font-bold block">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>

                    <h4 className="text-lg font-extrabold text-black dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors line-clamp-2">
                      {post.title}
                    </h4>

                    <p className="text-xs text-zinc-800 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between text-xs font-extrabold text-black dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-white transition-colors">
                    <span>Read Article</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Contact Form Section */}
      <ContactForm />
    </div>
  );
}
