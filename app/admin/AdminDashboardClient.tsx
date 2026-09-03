'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid,
  FiPlusCircle,
  FiTrash2,
  FiMail,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
  FiVideo,
  FiFolder,
  FiLink,
  FiShield,
  FiDatabase,
} from 'react-icons/fi';
import { createBlogPost, deleteBlogPost } from '@/app/actions/blogActions';
import { deleteContactMessage } from '@/app/actions/contactActions';

interface AdminDashboardClientProps {
  initialPosts: any[];
  initialMessages: any[];
  user: any;
}

export default function AdminDashboardClient({
  initialPosts,
  initialMessages,
  user,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'new-post' | 'messages' | 'account'>('posts');
  const [posts, setPosts] = useState(initialPosts);
  const [messages, setMessages] = useState(initialMessages);
  const [isPending, startTransition] = useTransition();
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCreatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;

    setFormStatus(null);

    startTransition(async () => {
      const res = await createBlogPost(formData);
      if (res.success) {
        setFormStatus({ type: 'success', message: 'Blog post published successfully!' });
        form.reset();
        if (res.post) {
          setPosts([res.post, ...posts]);
        }
        setTimeout(() => setActiveTab('posts'), 1200);
      } else {
        setFormStatus({ type: 'error', message: res.error || 'Failed to create post.' });
      }
    });
  };

  const handleDeletePost = (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    startTransition(async () => {
      const res = await deleteBlogPost(id);
      if (res.success) {
        setPosts(posts.filter((p) => p.id !== id));
      }
    });
  };

  const handleDeleteMessage = (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    startTransition(async () => {
      const res = await deleteContactMessage(id);
      if (res.success) {
        setMessages(messages.filter((m) => m.id !== id));
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-900 pb-3">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'posts'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
              : 'bg-zinc-100 text-zinc-700 hover:text-black dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-zinc-300 dark:border-zinc-800'
          }`}
        >
          <FiGrid className="w-4 h-4" />
          <span>Manage Blogs ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('new-post')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'new-post'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
              : 'bg-zinc-100 text-zinc-700 hover:text-black dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-zinc-300 dark:border-zinc-800'
          }`}
        >
          <FiPlusCircle className="w-4 h-4" />
          <span>New Blog Post</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'messages'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
              : 'bg-zinc-100 text-zinc-700 hover:text-black dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-zinc-300 dark:border-zinc-800'
          }`}
        >
          <FiMail className="w-4 h-4" />
          <span>Form Messages ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'account'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
              : 'bg-zinc-100 text-zinc-700 hover:text-black dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-zinc-300 dark:border-zinc-800'
          }`}
        >
          <FiUser className="w-4 h-4" />
          <span>Account &amp; Database</span>
        </button>
      </div>

      {/* TAB 1: MANAGE BLOGS */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black dark:text-white">Published Articles &amp; Media</h2>
            <button
              onClick={() => setActiveTab('new-post')}
              className="px-4 py-2 bg-black text-white dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg border border-black dark:border-zinc-700 text-xs font-semibold flex items-center gap-2"
            >
              <FiPlusCircle className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-200 dark:border-zinc-900 text-zinc-600">
              No posts found. Click &quot;New Blog Post&quot; to add your first post.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="glass-panel p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-black dark:text-zinc-400 border border-zinc-300 dark:border-zinc-800 font-bold">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.youtubeUrl && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-black dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800 flex items-center gap-1 font-bold">
                          <FiVideo className="w-3 h-3" /> YouTube Video
                        </span>
                      )}
                      {post.images && post.images.length > 0 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-black dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800 flex items-center gap-1 font-bold">
                          <FiFolder className="w-3 h-3" /> {post.images.length} Slides
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-black dark:text-white">{post.title}</h3>
                    <p className="text-xs text-zinc-700 dark:text-zinc-400 line-clamp-1">{post.excerpt}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href={`/blogs/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-black dark:text-zinc-300 rounded-lg text-xs font-semibold border border-zinc-300 dark:border-zinc-700 transition-colors"
                    >
                      View Live
                    </a>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      disabled={isPending}
                      className="p-2.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-red-100 dark:hover:bg-red-950/80 text-red-600 dark:text-red-400 hover:text-red-700 rounded-lg border border-zinc-300 dark:border-zinc-800 transition-colors"
                      title="Delete Post"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CREATE NEW BLOG POST */}
      {activeTab === 'new-post' && (
        <div className="glass-panel p-6 md:p-8 rounded-2xl max-w-3xl mx-auto space-y-6 border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 dark:border-zinc-900 pb-4">
            <h2 className="text-xl font-bold text-black dark:text-white">Create New Blog Post</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-normal">
              Add embedded YouTube video, picture slide folder images, rich text, and links.
            </p>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase font-bold text-black dark:text-zinc-300">
                Post Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Modern Innovations in Artificial Intelligence"
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-600 focus:outline-none focus:border-black dark:focus:border-white text-sm"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase font-bold text-black dark:text-zinc-300">
                Excerpt / Short Summary
              </label>
              <input
                type="text"
                name="excerpt"
                placeholder="Brief overview snippet displayed on article cards"
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-600 focus:outline-none focus:border-black dark:focus:border-white text-sm"
              />
            </div>

            {/* YouTube Video URL */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase font-bold text-black dark:text-zinc-300 flex items-center gap-2">
                <FiVideo className="text-black dark:text-white" />
                <span>Embedded YouTube Video URL</span>
              </label>
              <input
                type="url"
                name="youtubeUrl"
                placeholder="https://www.youtube.com/watch?v=XXXXXX or https://youtu.be/XXXXXX"
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-600 focus:outline-none focus:border-black dark:focus:border-white text-sm"
              />
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase font-bold text-black dark:text-zinc-300">
                Cover Thumbnail Image URL
              </label>
              <input
                type="url"
                name="thumbnailUrl"
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-600 focus:outline-none focus:border-black dark:focus:border-white text-sm"
              />
            </div>

            {/* Slide Folder Images (Comma Separated) */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase font-bold text-black dark:text-zinc-300 flex items-center gap-2">
                <FiFolder className="text-black dark:text-white" />
                <span>Picture Slide Folder Image URLs (Comma Separated)</span>
              </label>
              <textarea
                name="images"
                rows={3}
                placeholder="https://image1.jpg, https://image2.jpg, https://image3.jpg"
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-600 focus:outline-none focus:border-black dark:focus:border-white text-sm font-mono"
              />
            </div>

            {/* Content Body */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase font-bold text-black dark:text-zinc-300 flex items-center gap-2">
                <FiLink className="text-black dark:text-white" />
                <span>Article Body Content (Supports Links via [Text](URL))</span>
              </label>
              <textarea
                name="content"
                rows={8}
                required
                placeholder="Write article paragraphs here. Use [My Website](https://example.com) to embed links."
                className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-600 focus:outline-none focus:border-black dark:focus:border-white text-sm leading-relaxed"
              />
            </div>

            {/* Form Alert */}
            <AnimatePresence>
              {formStatus && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-xl flex items-center gap-3 border text-sm ${
                    formStatus.type === 'success'
                      ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-black dark:text-white'
                      : 'bg-red-50 dark:bg-zinc-950 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300'
                  }`}
                >
                  {formStatus.type === 'success' ? (
                    <FiCheckCircle className="w-5 h-5 text-black dark:text-white" />
                  ) : (
                    <FiAlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span>{formStatus.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Publish Blog Post</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: CONTACT FORM MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-black dark:text-white">Contact Submissions (PostgreSQL Database)</h2>
          {messages.length === 0 ? (
            <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-200 dark:border-zinc-900 text-zinc-600">
              No contact form submissions recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="glass-panel p-5 rounded-xl space-y-3 border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-3">
                    <div className="flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-black dark:text-white" />
                      <span className="text-sm font-bold text-black dark:text-white">{msg.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-500 font-medium">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        disabled={isPending}
                        className="p-1.5 text-zinc-500 hover:text-red-600 transition-colors"
                        title="Delete Message"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed font-normal">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ACCOUNT & SYSTEM */}
      {activeTab === 'account' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-900 pb-4">
              <FiShield className="w-6 h-6 text-black dark:text-white" />
              <div>
                <h3 className="text-base font-bold text-black dark:text-white">Clerk Account Credentials</h3>
                <p className="text-xs text-zinc-500">Authenticated Administrator</p>
              </div>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                <span className="text-zinc-600 dark:text-zinc-500">User ID</span>
                <span className="text-black dark:text-white font-bold truncate max-w-[200px]">{user.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                <span className="text-zinc-600 dark:text-zinc-500">Primary Email</span>
                <span className="text-black dark:text-white font-bold">{user.emailAddresses[0]?.emailAddress}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-600 dark:text-zinc-500">Created At</span>
                <span className="text-black dark:text-white font-bold">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-900 pb-4">
              <FiDatabase className="w-6 h-6 text-black dark:text-white" />
              <div>
                <h3 className="text-base font-bold text-black dark:text-white">Neon PostgreSQL Database</h3>
                <p className="text-xs text-zinc-500">Status: Active Connection</p>
              </div>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                <span className="text-zinc-600 dark:text-zinc-500">Total Blog Posts</span>
                <span className="text-black dark:text-white font-bold">{posts.length}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                <span className="text-zinc-600 dark:text-zinc-500">Contact Messages</span>
                <span className="text-black dark:text-white font-bold">{messages.length}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-600 dark:text-zinc-500">Provider</span>
                <span className="text-black dark:text-white font-bold">Neon AWS PostgreSQL (US East)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
