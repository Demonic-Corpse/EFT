import React from 'react';
import { Info } from 'lucide-react';

interface PlaceholderBadgeProps {
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export const PlaceholderBadge: React.FC<PlaceholderBadgeProps> = ({
  label = 'XYZ Placeholder',
  className = '',
  showIcon = true,
}) => {
  return (
    <span
      title="Placeholder content: to be replaced with verified academy records"
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-mono tracking-wider uppercase font-semibold text-amber-800 bg-amber-50 border border-amber-300 rounded-md shadow-sm ${className}`}
    >
      {showIcon && <Info className="w-3 h-3 text-amber-600 shrink-0" />}
      <span>{label}</span>
    </span>
  );
};
