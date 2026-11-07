import React, { useState, useMemo } from 'react';
import { Camera, Film, Play, Tag, Sparkles, Filter, Calendar } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/galleryData';
import { MediaCategory, GalleryItem } from '../types';
import { Lightbox } from '../components/album/Lightbox';
import { VideoModal } from '../components/album/VideoModal';
import { SectionHeading } from '../components/common/SectionHeading';

const CATEGORIES: MediaCategory[] = ['All', 'Training', 'Matches', 'Events', 'Videos'];

export const AlbumPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MediaCategory>('All');
  const [itemsList, setItemsList] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [lightboxItem, setLightboxItem] = useState<{ item: GalleryItem; index: number } | null>(
    null
  );
  const [activeVideo, setActiveVideo] = useState<GalleryItem | null>(null);

  // Fetch live published items from API
  React.useEffect(() => {
    fetch('/api/gallery/public')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: GalleryItem[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            category: d.category,
            mediaType: d.media_type || 'image',
            src: d.src,
            thumbnail: d.thumbnail || d.src,
            caption: d.caption || '',
            date: d.date || 'Recent Session',
            drillType: d.drill_type || '',
            videoDuration: d.video_duration || '',
            videoSource: d.video_source || d.src,
          }));
          setItemsList(mapped);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic gallery media:', err));
  }, []);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return itemsList;
    if (activeCategory === 'Videos') {
      return itemsList.filter((item) => item.mediaType === 'video' || item.category === 'Videos');
    }
    return itemsList.filter((item) => item.category === activeCategory);
  }, [activeCategory, itemsList]);

  const openMedia = (item: GalleryItem, index: number) => {
    if (item.mediaType === 'video') {
      setActiveVideo(item);
    } else {
      setLightboxItem({ item, index });
    }
  };

  const handlePrev = () => {
    if (!lightboxItem) return;
    const prevIndex =
      (lightboxItem.index - 1 + filteredItems.length) % filteredItems.length;
    setLightboxItem({ item: filteredItems[prevIndex], index: prevIndex });
  };

  const handleNext = () => {
    if (!lightboxItem) return;
    const nextIndex = (lightboxItem.index + 1) % filteredItems.length;
    setLightboxItem({ item: filteredItems[nextIndex], index: nextIndex });
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 text-slate-900 min-h-screen">
      {/* Page Hero */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-amber-50/60 via-slate-50 to-slate-50 border-b border-slate-200 overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1800&q=80"
            alt="Football floodlights training"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-50/85" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-800 text-xs font-heading font-bold uppercase tracking-widest mb-6 shadow-sm">
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span>Academy Media Showcase</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display uppercase tracking-tight text-slate-900 leading-none mb-6">
            INSIDE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 drop-shadow-[0_2px_15px_rgba(217,119,6,0.25)]">
              THE GAME.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Every drill, every session, every step forward.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Tabs Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-8 border-b border-slate-200 gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-heading uppercase tracking-wider font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-slate-500">
            Showing <strong className="text-slate-900">{filteredItems.length}</strong> items in{' '}
            <span className="text-amber-600 font-bold">{activeCategory}</span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const isVideo = item.mediaType === 'video';

            return (
              <div
                key={item.id}
                onClick={() => openMedia(item, index)}
                className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col"
              >
                {/* Media Image / Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-heading uppercase font-bold tracking-wider bg-white/95 border border-slate-200 text-slate-900 shadow-sm backdrop-blur-md">
                      {item.category}
                    </span>
                    {isVideo && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-slate-950" />
                        <span>VIDEO</span>
                      </span>
                    )}
                  </div>

                  {/* Date badge */}
                  <div className="absolute top-3.5 right-3.5 text-[10px] font-mono text-slate-200 bg-slate-950/80 px-2 py-1 rounded border border-white/10 backdrop-blur-md">
                    {item.date}
                  </div>

                  {/* Big Play button if video */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading uppercase text-lg font-bold text-slate-900 tracking-wide group-hover:text-amber-600 transition-colors line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                    <span>{item.drillType || 'Session Focus'}</span>
                    <span className="text-amber-600 font-bold group-hover:underline">
                      {isVideo ? 'Play Video' : 'View Lightbox'} &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <Lightbox
          item={lightboxItem.item}
          currentIndex={lightboxItem.index}
          totalItems={filteredItems.length}
          onClose={() => setLightboxItem(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
};
