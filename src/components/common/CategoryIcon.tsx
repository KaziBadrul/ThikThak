import React from 'react';
import {
  Zap,
  ShoppingBag,
  Home,
  Wifi,
  Car,
  Droplets,
  Receipt,
  Utensils,
} from 'lucide-react';

interface CategoryIconProps {
  category?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category = 'other',
  size = 'md',
  className = '',
}) => {
  const cat = category.toLowerCase();

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2.5',
    lg: 'w-14 h-14 p-3.5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  let icon = <Receipt className={iconSizes[size]} />;
  let colorBg = 'bg-[#EFECE4] text-[#1E3932]';

  if (cat.includes('electric') || cat.includes('util') || cat.includes('bulb')) {
    icon = <Zap className={iconSizes[size]} />;
    colorBg = 'bg-[#EBF3E8] text-[#3D7A4C]'; // soft green
  } else if (cat.includes('groc') || cat.includes('food') || cat.includes('market') || cat.includes('kitchen')) {
    icon = <ShoppingBag className={iconSizes[size]} />;
    colorBg = 'bg-[#FBECE6] text-[#C45E3D]'; // soft terracotta / peach
  } else if (cat.includes('rent') || cat.includes('house') || cat.includes('room')) {
    icon = <Home className={iconSizes[size]} />;
    colorBg = 'bg-[#F0EEF8] text-[#5C5196]'; // soft lavender
  } else if (cat.includes('internet') || cat.includes('wifi') || cat.includes('fiber')) {
    icon = <Wifi className={iconSizes[size]} />;
    colorBg = 'bg-[#FFF3DC] text-[#B87A14]'; // soft amber
  } else if (cat.includes('water') || cat.includes('aqua')) {
    icon = <Droplets className={iconSizes[size]} />;
    colorBg = 'bg-[#E8F3F8] text-[#2C7A9E]'; // soft blue
  } else if (cat.includes('trans') || cat.includes('uber') || cat.includes('car')) {
    icon = <Car className={iconSizes[size]} />;
    colorBg = 'bg-[#F3EFE9] text-[#556358]'; // soft slate
  }

  return (
    <div
      className={`rounded-2xl flex items-center justify-center shrink-0 ${sizeClasses[size]} ${colorBg} ${className}`}
    >
      {icon}
    </div>
  );
};
