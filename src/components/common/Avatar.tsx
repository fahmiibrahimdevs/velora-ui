import React, { useState } from 'react';
import { User } from 'lucide-react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarShape = 'circle' | 'rounded' | 'square';
export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline';

export interface AvatarProps {
  src?: string;
  name?: string;
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  subIcon?: React.ReactNode;
  bg?: string;
  textColor?: string;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export const getInitials = (name: string): string => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  initials,
  size = 'md',
  shape = 'circle',
  status,
  subIcon,
  bg = 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0]',
  textColor = 'text-white',
  className = '',
  alt,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses: Record<AvatarSize, { box: string; text: string; icon: string; dot: string }> = {
    xs: { box: 'w-6 h-6', text: 'text-[10px]', icon: 'w-3 h-3', dot: 'w-2 h-2 border-[1.5px]' },
    sm: { box: 'w-8 h-8', text: 'text-xs', icon: 'w-4 h-4', dot: 'w-2.5 h-2.5 border-2' },
    md: { box: 'w-10 h-10', text: 'text-sm font-bold', icon: 'w-5 h-5', dot: 'w-3 h-3 border-2' },
    lg: { box: 'w-12 h-12', text: 'text-base font-bold', icon: 'w-6 h-6', dot: 'w-3.5 h-3.5 border-2' },
    xl: { box: 'w-16 h-16', text: 'text-xl font-bold', icon: 'w-8 h-8', dot: 'w-4 h-4 border-2' },
    '2xl': { box: 'w-20 h-20', text: 'text-2xl font-bold', icon: 'w-10 h-10', dot: 'w-5 h-5 border-2' },
  };

  const shapeClasses: Record<AvatarShape, string> = {
    circle: 'rounded-full',
    rounded: 'rounded-2xl',
    square: 'rounded-xl',
  };

  const statusColors: Record<AvatarStatus, string> = {
    online: 'bg-emerald-500',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-400',
  };

  const computedInitials = initials || (name ? getInitials(name) : '');
  const config = sizeClasses[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${config.box} ${
        onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''
      } ${className}`}
    >
      {/* Main Avatar Container */}
      <div
        className={`w-full h-full overflow-hidden flex items-center justify-center shadow-xs ${
          shapeClasses[shape]
        } ${src && !imageError ? 'bg-slate-100' : `${bg} ${textColor}`}`}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : computedInitials ? (
          <span className={`${config.text} uppercase tracking-tight`}>{computedInitials}</span>
        ) : (
          <User className={config.icon} />
        )}
      </div>

      {/* Presence Status Dot Indicator */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${config.dot} ${statusColors[status]} border-white rounded-full shadow-xs`}
          title={`Status: ${status}`}
        />
      )}

      {/* Sub-Icon or Corner Badge */}
      {subIcon && !status && (
        <div className="absolute -bottom-1 -right-1 flex items-center justify-center shadow-xs">
          {subIcon}
        </div>
      )}
    </div>
  );
};

export interface AvatarGroupProps {
  max?: number;
  size?: AvatarSize;
  spacing?: string;
  className?: string;
  children: React.ReactNode;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  max = 4,
  size = 'md',
  spacing = '-space-x-2.5',
  className = '',
  children,
}) => {
  const childrenArray = React.Children.toArray(children);
  const visibleAvatars = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  const sizeBoxClasses: Record<AvatarSize, string> = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs font-bold',
    lg: 'w-12 h-12 text-sm font-bold',
    xl: 'w-16 h-16 text-base font-bold',
    '2xl': 'w-20 h-20 text-lg font-bold',
  };

  return (
    <div className={`flex items-center ${spacing} ${className}`}>
      {visibleAvatars.map((child, index) => (
        <div key={index} className="ring-2 ring-white rounded-full">
          {child}
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={`relative inline-flex items-center justify-center shrink-0 rounded-full bg-slate-200 text-slate-700 ring-2 ring-white shadow-xs ${sizeBoxClasses[size]}`}
          title={`${remainingCount} anggota lainnya`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
