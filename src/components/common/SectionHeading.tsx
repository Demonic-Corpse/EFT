import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div className={`mb-12 md:mb-16 ${isCenter ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} ${className}`}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 mb-3 ${isCenter ? 'justify-center' : 'justify-start'}`}>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-amber-600">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-wide text-slate-900 leading-none">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
      <div className={`mt-5 flex items-center gap-2 ${isCenter ? 'justify-center' : 'justify-start'}`}>
        <div className="h-1.5 w-12 bg-amber-500 rounded-full shadow-glow-sm" />
        <div className="h-1.5 w-3 bg-slate-300 rounded-full" />
      </div>
    </div>
  );
};
