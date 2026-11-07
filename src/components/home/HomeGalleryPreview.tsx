import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Camera, Tag } from 'lucide-react';
import { GALLERY_ITEMS } from '../../data/galleryData';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';

export const HomeGalleryPreview: React.FC = () => {
  // Take 6 curated items representing various drills and matches
  const previewItems = GALLERY_ITEMS.slice(0, 6);

  return (
    <section className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            eyebrow="On The Pitch"
            title="TRAINING GALLERY"
            subtitle="Catch the intensity, commitment, and pure energy of our academy training sessions and weekend matches."
            align="left"
            className="mb-0"
          />

          <div className="shrink-0">
            <Button
              to="/album"
              variant="outline"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View Full Album
            </Button>
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {previewItems.map((item) => (
            <Link
              key={item.id}
              to="/album"
              className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 block aspect-[4/3]"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Top Meta Tag */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-heading uppercase font-bold tracking-wider bg-white/95 border border-slate-200 text-slate-800 shadow-sm backdrop-blur-md">
                  <Tag className="w-3 h-3 text-amber-600" />
                  <span>{item.category}</span>
                </span>
                {item.mediaType === 'video' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950 shadow-sm">
                    VIDEO
                  </span>
                )}
              </div>

              {/* Center Play Button for Videos */}
              {item.mediaType === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                  </div>
                </div>
              )}

              {/* Bottom Caption & Date */}
              <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform">
                <h3 className="text-lg font-heading uppercase font-bold text-white tracking-wide group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>{item.drillType || 'Session Drill'}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Sample media showcase: Live high-resolution training album with interactive lightbox available on Album page.</span>
          </div>
          <Link
            to="/album"
            className="text-amber-600 hover:text-amber-700 hover:underline font-heading font-bold uppercase tracking-wider shrink-0"
          >
            Open Media Gallery &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};
