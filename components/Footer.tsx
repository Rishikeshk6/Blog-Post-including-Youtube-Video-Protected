'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowUp } from 'react-icons/fi';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-zinc-50 dark:bg-black border-t border-zinc-200 dark:border-zinc-900 py-12 px-4 md:px-8 text-zinc-600 dark:text-zinc-400 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left branding */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <span className="text-zinc-900 dark:text-white font-serif font-bold text-xl tracking-tight">
            Durga Prasad Satapathy
          </span>
          <p className="text-xs text-zinc-500 max-w-sm">
            A digital repository for insights, embedded video features, rich picture slide folders, and publications.
          </p>
        </div>

        {/* Links & Socials */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/blogs" className="hover:text-black dark:hover:text-white transition-colors">
            Blogs &amp; Videos
          </Link>
          <Link href="/#contact" className="hover:text-black dark:hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="/admin" className="hover:text-black dark:hover:text-white transition-colors">
            Admin
          </Link>
        </div>

        {/* Back to top & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-3 text-xs text-zinc-500 dark:text-zinc-600">
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-700 transition-all flex items-center gap-2 shadow-sm"
          >
            <FiArrowUp className="w-4 h-4" />
            <span>Top</span>
          </button>
          <span>&copy; {new Date().getFullYear()} Durga Prasad Satapathy. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
