'use client';

import React, { useEffect, useRef, useState, useId } from 'react';
import { FiPlay, FiPause, FiTv, FiShield } from 'react-icons/fi';

interface YouTubeEmbedProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

function extractYouTubeId(url: string): string {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : url;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoUrl, title, className = '' }) => {
  const videoId = extractYouTubeId(videoUrl);
  const reactId = useId();
  const playerElementId = `yt-player-${reactId.replace(/:/g, '')}`;
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    if (!videoId) return;

    // Listen for play event from other players on the website
    const handleOtherPlay = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.instanceId !== playerElementId) {
        if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener('youtube-play-started', handleOtherPlay);

    // Initialize YouTube iFrame API
    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(playerElementId, {
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            controls: 1,
            fs: 1,
            disablekb: 0,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
            widget_referrer: typeof window !== 'undefined' ? window.location.origin : '',
          },
          events: {
            onReady: () => {
              setIsPlayerReady(true);
            },
            onStateChange: (event: any) => {
              // YT.PlayerState.PLAYING is 1
              if (event.data === 1) {
                setIsPlaying(true);
                // Dispatch event to pause all other videos on the website
                window.dispatchEvent(
                  new CustomEvent('youtube-play-started', {
                    detail: { instanceId: playerElementId, videoId },
                  })
                );
              } else if (event.data === 2 || event.data === 0) {
                // PAUSED (2) or ENDED (0)
                setIsPlaying(false);
              }
            },
          },
        });
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      window.removeEventListener('youtube-play-started', handleOtherPlay);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [videoId, playerElementId]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      if (typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
      }
    } else {
      if (typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
      }
    }
  };

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-zinc-900 rounded-xl flex flex-col items-center justify-center text-zinc-500 border border-zinc-800">
        <FiTv className="w-10 h-10 mb-2 text-zinc-600" />
        <span className="text-sm">No video URL provided</span>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden rounded-xl bg-black border border-zinc-800 shadow-2xl relative group ${className}`}>
      {/* Top Title Bar with Protected Badge */}
      {title && (
        <div className="bg-zinc-900/90 px-4 py-2 text-xs font-semibold text-zinc-300 border-b border-zinc-800 flex items-center justify-between z-30 relative select-none">
          <div className="flex items-center gap-2 truncate">
            <FiPlay className="text-white w-3 h-3 shrink-0" />
            <span className="truncate">{title}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono shrink-0 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
            <FiShield className="w-3 h-3" />
            <span>Protected Stream</span>
          </div>
        </div>
      )}

      {/* Main Video Frame & Click Shield Overlay */}
      <div className="relative w-full aspect-video bg-black">
        {/* YouTube iFrame Target Container */}
        <div id={playerElementId} className="w-full h-full absolute inset-0 z-0" />

        {/* SECURITY SHIELD OVERLAY 1: Top Bar Click Shield (Blocks YouTube Title/Channel Links) */}
        <div
          className="absolute top-0 left-0 right-0 h-16 z-20 bg-transparent cursor-default pointer-events-auto"
          title="Protected Stream - Playback controlled on website"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        />

        {/* SECURITY SHIELD OVERLAY 2: Bottom-Right YouTube Logo Shield (Blocks YouTube Logo Redirect) */}
        <div
          className="absolute bottom-0 right-0 w-36 h-12 z-20 bg-transparent cursor-default pointer-events-auto"
          title="Protected Stream"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />

        {/* Custom Play Backdrop Button overlay when video is paused */}
        {!isPlaying && isPlayerReady && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 z-10 bg-black/40 hover:bg-black/20 transition-all flex items-center justify-center cursor-pointer group-hover:scale-105"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 text-black flex items-center justify-center shadow-2xl backdrop-blur-md transition-all hover:scale-110">
              <FiPlay className="w-7 h-7 translate-x-0.5 text-black" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
