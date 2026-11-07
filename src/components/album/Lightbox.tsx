import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Tag, Calendar, Info } from 'lucide-react';
import { GalleryItem } from '../../types';

interface LightboxProps {
  item: GalleryItem;
  currentIndex: number;
  totalItems: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  item,
  currentIndex,
  totalItems,
  onClose,
  onPrev,
  onNext,
}) => {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  // Lock background scroll
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
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      <button
        type="button"
        onClick={onPrev}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/90 text-slate-200 hover:text-amber-400 hover:bg-slate-800 border border-white/20 shadow-md transition-all focus:outline-none"
        aria-label="Previous item"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={onNext}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/90 text-slate-200 hover:text-amber-400 hover:bg-slate-800 border border-white/20 shadow-md transition-all focus:outline-none"
        aria-label="Next item"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Modal Container */}
      <div className="relative max-w-5xl w-full flex flex-col items-center max-h-[90vh]">
        {/* Main Image */}
        <div className="relative w-full max-h-[72vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black border border-white/10">
          <img
            src={item.src}
            alt={item.title}
            className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl select-none"
          />
        </div>

        {/* Caption & Metadata Bar */}
        <div className="w-full mt-4 p-4 rounded-xl bg-slate-900/95 border border-white/10 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500 text-slate-950">
                {item.category}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Item {currentIndex + 1} of {totalItems}
              </span>
            </div>
            <h3 className="font-heading uppercase text-lg sm:text-xl font-bold text-white tracking-wide">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
              {item.caption}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-amber-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-amber-500/30">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>{item.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
