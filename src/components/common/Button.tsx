import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  icon,
  iconPosition = 'right',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-heading font-semibold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed select-none group';

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 rounded-md gap-1.5',
    md: 'text-sm sm:text-base px-6 py-3 rounded-lg gap-2',
    lg: 'text-base sm:text-lg px-8 py-4 rounded-xl gap-2.5 font-bold tracking-widest',
  };

  const variantStyles = {
    primary:
      'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold hover:shadow-glow-md active:scale-[0.98] border border-amber-500 shadow-sm',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 hover:border-amber-500 hover:text-amber-700 hover:shadow-sm active:scale-[0.98]',
    outline:
      'bg-transparent hover:bg-amber-50 text-amber-700 border border-amber-500 hover:border-amber-600 hover:shadow-glow-sm active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 active:scale-[0.98]',
  };

  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="transition-transform group-hover:-translate-x-0.5">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="transition-transform group-hover:translate-x-1">{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedStyles}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={combinedStyles}>
        {content}
      </a>
    );
  }

  return (
    <button className={combinedStyles} disabled={disabled} {...props}>
      {content}
    </button>
  );
};
