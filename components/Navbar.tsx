'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';
import { useTheme } from '@/components/ThemeProvider';
import { FiFeather, FiGrid, FiMail, FiUser, FiMenu, FiX, FiShield, FiSun, FiMoon } from 'react-icons/fi';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { isSignedIn, isLoaded, user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isRoleChecked, setIsRoleChecked] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check admin role against PostgreSQL database via API
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setIsAdmin(false);
      setIsRoleChecked(true);
      return;
    }

    fetch('/api/user/role')
      .then((res) => res.json())
      .then((data) => {
        setIsAdmin(Boolean(data.isAdmin));
        setIsRoleChecked(true);
      })
      .catch(() => {
        setIsAdmin(false);
        setIsRoleChecked(true);
      });
  }, [isLoaded, isSignedIn, user]);

  const navLinks = [
    { name: 'Home', href: '/', icon: FiFeather },
    { name: 'Blogs & Videos', href: '/blogs', icon: FiGrid },
    { name: 'Contact', href: '/#contact', icon: FiMail },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-black/85 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 py-3 shadow-md'
          : 'bg-white/90 dark:bg-transparent backdrop-blur-sm py-4 border-b border-zinc-100 dark:border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand Name */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black text-white dark:bg-zinc-900 dark:text-white border border-black dark:border-zinc-700 flex items-center justify-center font-bold tracking-widest text-lg group-hover:scale-105 transition-all shadow-md">
            DPS
          </div>
          <div className="flex flex-col">
            <span className="brand-title font-serif font-extrabold text-base md:text-lg tracking-tight transition-colors">
              Durga Prasad Satapathy
            </span>
            <span className="text-[10px] text-zinc-700 dark:text-zinc-400 uppercase font-mono tracking-widest font-bold">
              Official Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900/60 p-1.5 rounded-full border border-zinc-300 dark:border-zinc-800 backdrop-blur-sm shadow-inner">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold tracking-wider transition-all ${
                  isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                    : 'text-zinc-800 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Authentication, Theme Toggle & Admin Button */}
        <div className="hidden md:flex items-center gap-3 min-h-[40px]">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-black dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all shadow-sm"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <FiMoon className="w-4 h-4 text-black" />
            ) : (
              <FiSun className="w-4 h-4 text-amber-300" />
            )}
          </button>

          {isLoaded ? (
            isSignedIn ? (
              <>
                {/* Render Admin Panel Button ONLY for Database Verified Admin Accounts */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-black dark:bg-zinc-900 text-white border border-black dark:border-zinc-700 hover:bg-zinc-800 text-xs font-bold transition-all shadow-sm"
                  >
                    <FiShield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9 border border-zinc-300 dark:border-zinc-700',
                    },
                  }}
                />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-extrabold uppercase tracking-wider transition-all shadow-md">
                  <FiUser className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </SignInButton>
            )
          ) : (
            <div className="w-20 h-9 bg-zinc-200 dark:bg-zinc-900 rounded-lg animate-pulse" />
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-black dark:text-zinc-200 border border-zinc-300 dark:border-zinc-800"
          >
            {theme === 'light' ? <FiMoon className="w-5 h-5 text-black" /> : <FiSun className="w-5 h-5 text-amber-300" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-black dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950/95 border-b border-zinc-200 dark:border-zinc-800 px-6 py-6 space-y-4 shadow-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-sm font-bold text-black dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-white py-2 border-b border-zinc-100 dark:border-zinc-900"
              >
                <Icon className="w-4 h-4 text-zinc-800" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 flex items-center justify-between">
            {isLoaded && isSignedIn ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-xs font-bold"
                  >
                    <FiShield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <UserButton />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs uppercase tracking-wider">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
