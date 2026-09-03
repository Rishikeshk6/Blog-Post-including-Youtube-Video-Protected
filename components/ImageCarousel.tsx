'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX, FiFolder, FiPlay, FiPause } from 'react-icons/fi';

interface ImageCarouselProps {
  images: string[];
  title?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto 5-Second Scrolling logic with Hover Pause
  useEffect(() => {
    if (!images || images.length <= 1 || isLightboxOpen || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images, isLightboxOpen, isHovered]);

  if (!images || images.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="w-full my-6 shadow-md rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slide Folder Header */}
      <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-900/80 px-4 py-2.5 rounded-t-xl border-t border-x border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FiFolder className="text-zinc-500 dark:text-zinc-400 w-4 h-4" />
          <span>{title || 'Picture Slide Folder'}</span>
        </div>
        <div className="flex items-center gap-3">
          {images.length > 1 && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              {isHovered ? (
                <>
                  <FiPause className="w-3 h-3 text-amber-500" />
                  <span>Paused</span>
                </>
              ) : (
                <>
                  <FiPlay className="w-3 h-3 text-emerald-500 animate-pulse" />
                  <span>Auto 5s</span>
                </>
              )}
            </span>
          )}
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono font-bold">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Main Slide Display */}
      <div className="relative w-full aspect-video bg-zinc-950 border-x border-b border-zinc-200 dark:border-zinc-800 rounded-b-xl overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          />
        </AnimatePresence>

        {/* Next / Prev Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all opacity-80 group-hover:opacity-100"
              aria-label="Previous Slide"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all opacity-80 group-hover:opacity-100"
              aria-label="Next Slide"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Maximize Icon */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute right-3 bottom-3 p-2 rounded-lg bg-black/70 hover:bg-black text-zinc-300 border border-zinc-700/50 backdrop-blur-sm transition-all"
          title="Full View"
        >
          <FiMaximize2 className="w-4 h-4" />
        </button>

        {/* Dot Pagination */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 transition-all"
            >
              <FiX className="w-6 h-6" />
            </button>
            <img
              src={images[currentIndex]}
              alt={`Fullscreen ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg border border-zinc-800 shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
