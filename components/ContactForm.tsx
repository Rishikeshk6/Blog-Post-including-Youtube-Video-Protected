'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiMessageSquare, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { submitContactForm } from '@/app/actions/contactActions';

export const ContactForm: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formElement = e.currentTarget;

    setStatus(null);

    startTransition(async () => {
      const result = await submitContactForm(formData);
      if (result.success) {
        setStatus({ type: 'success', message: result.message || 'Message sent successfully!' });
        formElement.reset();
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to send message.' });
      }
    });
  };

  return (
    <section id="contact" className="w-full py-20 px-4 relative subtle-grid">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-black dark:text-zinc-400 border border-zinc-300 dark:border-zinc-800 px-3.5 py-1 rounded-full bg-white dark:bg-zinc-950 shadow-sm">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-black dark:text-white mt-4 tracking-tight">
            Let&apos;s Connect &amp; Collaborate
          </h2>
          <p className="text-zinc-700 dark:text-zinc-400 mt-3 max-w-lg mx-auto text-sm md:text-base font-normal">
            Have a project, inquiry, or just want to discuss ideas? Send a direct message below.
          </p>
        </div>

        {/* 2-Box Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Box 1: Email Address */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs uppercase font-extrabold tracking-wider text-black dark:text-zinc-300">
                Box 1: Your Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-700 dark:text-zinc-400">
                  <FiMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="name@domain.com"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-950 border-2 border-zinc-300 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Box 2: Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-xs uppercase font-extrabold tracking-wider text-black dark:text-zinc-300">
                Box 2: Message / Discussion Topic
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none text-zinc-700 dark:text-zinc-400">
                  <FiMessageSquare className="w-5 h-5" />
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Type your message, inquiry, or feedback here..."
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-950 border-2 border-zinc-300 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-sm font-medium resize-none"
                />
              </div>
            </div>

            {/* Status Alert */}
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-xl flex items-center gap-3 border text-sm ${
                    status.type === 'success'
                      ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-black dark:text-white'
                      : 'bg-red-50 dark:bg-zinc-950 border-red-300 dark:border-red-900/50 text-red-700 dark:text-red-300'
                  }`}
                >
                  {status.type === 'success' ? (
                    <FiCheckCircle className="w-5 h-5 text-black dark:text-white shrink-0" />
                  ) : (
                    <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                  <span>{status.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 px-6 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] disabled:opacity-50"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  <span>Send Direct Message</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
