import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { checkIsAdmin } from '@/lib/adminAuth';
import { getAllPosts } from '@/app/actions/blogActions';
import { getContactMessages } from '@/app/actions/contactActions';
import AdminDashboardClient from './AdminDashboardClient';
import { FiLock, FiHome, FiUserX } from 'react-icons/fi';

export const revalidate = 0;

export default async function AdminPage() {
  const { isAdmin, email, user } = await checkIsAdmin();

  if (!user) {
    redirect('/sign-in');
  }

  // If user is logged in with a NORMAL account (not listed in AdminUser PostgreSQL table)
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
          <FiLock className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
          Access Restricted
        </span>

        <h1 className="text-3xl font-extrabold text-black dark:text-white tracking-tight">
          Administrator Privileges Required
        </h1>

        <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed max-w-lg mx-auto">
          Logged in as <span className="font-bold text-black dark:text-white">{email}</span> (Normal Account).
          <br />
          The Admin Control Center is strictly restricted to authorized administrators recorded in the PostgreSQL database (<span className="font-mono text-xs font-bold text-black dark:text-white">anand.aisuite@gmail.com</span>).
        </p>

        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2"
          >
            <FiHome className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    );
  }

  // Admin Account verified against PostgreSQL DB!
  const posts = await getAllPosts();
  const messages = await getContactMessages();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
              Verified Administrator
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white tracking-tight mt-2">
            Admin Management Panel
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Logged in as <span className="text-black dark:text-white font-bold">{email}</span>
          </p>
        </div>
      </div>

      <AdminDashboardClient initialPosts={posts} initialMessages={messages} user={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
