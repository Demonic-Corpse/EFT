import React, { useEffect, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, AlertCircle, Film, Maximize } from 'lucide-react';
import { GalleryItem } from '../../types';

interface VideoModalProps {
  item: GalleryItem;
  onClose: () => void;
}

const getEmbedUrl = (url?: string) => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }
  return null;
};

export const VideoModal: React.FC<VideoModalProps> = ({ item, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const embedUrl = getEmbedUrl(item.videoSource);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 border border-white/20 transition-all focus:outline-none"
        aria-label="Close video player"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative max-w-4xl w-full flex flex-col items-center">
        {/* Video Player Box */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-amber-400/40 shadow-2xl flex items-center justify-center">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={item.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : !videoError && item.videoSource ? (
            <video
              src={item.videoSource}
              poster={item.src}
              autoPlay
              controls
              loop
              playsInline
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            /* Attractive Fallback Simulation Video Frame */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900">
              <img
                src={item.src}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-sm"
              />
              <div className="relative z-10 max-w-md space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 shadow-lg">
                  <Film className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-heading uppercase font-bold text-white tracking-wide">
                  Demo Video Simulation: {item.title}
                </h4>
                <p className="text-xs text-slate-300">
                  {item.caption}
                </p>
                <div className="p-3 rounded-lg bg-slate-950/90 border border-amber-400/30 text-xs text-amber-300 font-mono">
                  [Sample Video Notice: To hook up official 4K academy drills, place local MP4 files in the public directory or configure YouTube/Vimeo embed URLs in mediaData.ts]
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Info Bottom Bar */}
        <div className="w-full mt-4 p-4 rounded-xl bg-slate-900/95 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500 text-slate-950">
                VIDEO SESSION
              </span>
              {item.videoDuration && (
                <span className="text-xs font-mono text-slate-400">
                  Length: {item.videoDuration}
                </span>
              )}
            </div>
            <h3 className="font-heading uppercase text-lg font-bold text-white tracking-wide">
              {item.title}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">{item.caption}</p>
          </div>

          <div className="shrink-0 text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-white/10">
            {item.date}
          </div>
        </div>
      </div>
    </div>
  );
};
