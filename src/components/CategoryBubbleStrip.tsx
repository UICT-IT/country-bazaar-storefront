'use client';

import React from 'react';
import {
  LayoutGrid,
  Sprout,
  Beef,
  Croissant,
  Milk,
  ShoppingBasket,
  Coffee,
  Sparkles,
  Snowflake,
  Package,
  Flame,
  Apple,
  Wheat,
  Cookie,
  Wine,
  Home,
} from 'lucide-react';

interface CategoryBubbleStripProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

interface StyleTheme {
  bg: string;
  iconColor: string;
  ring: string;
  icon: React.ReactNode;
}

const THEMES: StyleTheme[] = [
  {
    bg: 'bg-red-50/90',
    iconColor: 'text-red-700',
    ring: 'ring-red-200/70',
    icon: <LayoutGrid className="w-7 h-7 stroke-[1.75]" />,
  },
  {
    bg: 'bg-emerald-50/90',
    iconColor: 'text-emerald-800',
    ring: 'ring-emerald-200/70',
    icon: <Sprout className="w-7 h-7 stroke-[1.75]" />,
  },
  {
    bg: 'bg-rose-50/90',
    iconColor: 'text-rose-800',
    ring: 'ring-rose-200/70',
    icon: <Beef className="w-7 h-7 stroke-[1.75]" />,
  },
  {
    bg: 'bg-amber-50/90',
    iconColor: 'text-amber-700',
    ring: 'ring-amber-200/70',
    icon: <Croissant className="w-7 h-7 stroke-[1.75]" />,
  },
  {
    bg: 'bg-sky-50/90',
    iconColor: 'text-sky-800',
    ring: 'ring-sky-200/70',
    icon: <Milk className="w-7 h-7 stroke-[1.75]" />,
  },
  {
    bg: 'bg-stone-100/90',
    iconColor: 'text-stone-800',
    ring: 'ring-stone-300/70',
    icon: <ShoppingBasket className="w-7 h-7 stroke-[1.75]" />,
  },
  {
    bg: 'bg-orange-50/90',
    iconColor: 'text-orange-800',
    ring: 'ring-orange-200/70',
    icon: <Coffee className="w-7 h-7 stroke-[1.75]" />,
  },
  {
    bg: 'bg-teal-50/90',
    iconColor: 'text-teal-800',
    ring: 'ring-teal-200/70',
    icon: <Sparkles className="w-7 h-7 stroke-[1.75]" />,
  },
];

function getCategoryStyle(category: string, index: number): StyleTheme {
  const key = category.toLowerCase();

  if (key === 'all') {
    return {
      bg: 'bg-red-50/90',
      iconColor: 'text-red-700',
      ring: 'ring-red-200/80',
      icon: <LayoutGrid className="w-7 h-7 stroke-[1.75]" />,
    };
  }
  if (key.includes('produce') || key.includes('fruit') || key.includes('veg') || key.includes('fresh')) {
    return {
      bg: 'bg-emerald-50/90',
      iconColor: 'text-emerald-800',
      ring: 'ring-emerald-200/80',
      icon: key.includes('fruit') ? (
        <Apple className="w-7 h-7 stroke-[1.75]" />
      ) : (
        <Sprout className="w-7 h-7 stroke-[1.75]" />
      ),
    };
  }
  if (key.includes('meat') || key.includes('butcher') || key.includes('beef') || key.includes('lamb') || key.includes('poultry')) {
    return {
      bg: 'bg-rose-50/90',
      iconColor: 'text-rose-800',
      ring: 'ring-rose-200/80',
      icon: <Beef className="w-7 h-7 stroke-[1.75]" />,
    };
  }
  if (key.includes('bak') || key.includes('bread') || key.includes('pastry')) {
    return {
      bg: 'bg-amber-50/90',
      iconColor: 'text-amber-700',
      ring: 'ring-amber-200/80',
      icon: <Croissant className="w-7 h-7 stroke-[1.75]" />,
    };
  }
  if (key.includes('dairy') || key.includes('milk') || key.includes('cheese') || key.includes('egg')) {
    return {
      bg: 'bg-sky-50/90',
      iconColor: 'text-sky-800',
      ring: 'ring-sky-200/80',
      icon: <Milk className="w-7 h-7 stroke-[1.75]" />,
    };
  }
  if (key.includes('beverage') || key.includes('drink') || key.includes('coffee') || key.includes('tea')) {
    return {
      bg: 'bg-orange-50/90',
      iconColor: 'text-orange-800',
      ring: 'ring-orange-200/80',
      icon: key.includes('wine') || key.includes('juice') ? (
        <Wine className="w-7 h-7 stroke-[1.75]" />
      ) : (
        <Coffee className="w-7 h-7 stroke-[1.75]" />
      ),
    };
  }
  if (key.includes('frozen') || key.includes('cold') || key.includes('ice')) {
    return {
      bg: 'bg-cyan-50/90',
      iconColor: 'text-cyan-800',
      ring: 'ring-cyan-200/80',
      icon: <Snowflake className="w-7 h-7 stroke-[1.75]" />,
    };
  }
  if (key.includes('snack') || key.includes('biscuit') || key.includes('sweet') || key.includes('chocolate')) {
    return {
      bg: 'bg-yellow-50/90',
      iconColor: 'text-yellow-800',
      ring: 'ring-yellow-200/80',
      icon: <Cookie className="w-7 h-7 stroke-[1.75]" />,
    };
  }
  if (key.includes('grain') || key.includes('flour') || key.includes('rice') || key.includes('spice')) {
    return {
      bg: 'bg-lime-50/90',
      iconColor: 'text-lime-800',
      ring: 'ring-lime-200/80',
      icon: key.includes('spice') || key.includes('bbq') ? (
        <Flame className="w-7 h-7 stroke-[1.75]" />
      ) : (
        <Wheat className="w-7 h-7 stroke-[1.75]" />
      ),
    };
  }
  if (key.includes('clean') || key.includes('home') || key.includes('household')) {
    return {
      bg: 'bg-indigo-50/90',
      iconColor: 'text-indigo-800',
      ring: 'ring-indigo-200/80',
      icon: <Home className="w-7 h-7 stroke-[1.75]" />,
    };
  }
  if (key.includes('pantry') || key.includes('grocery')) {
    return {
      bg: 'bg-stone-100/90',
      iconColor: 'text-stone-800',
      ring: 'ring-stone-300/80',
      icon: <ShoppingBasket className="w-7 h-7 stroke-[1.75]" />,
    };
  }

  const fallback = THEMES[index % THEMES.length];
  return {
    ...fallback,
    icon: <Package className="w-7 h-7 stroke-[1.75]" />,
  };
}

export default function CategoryBubbleStrip({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryBubbleStripProps) {
  const scrollToGrid = () => {
    const gridEl = document.getElementById('products-grid');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-white border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-start justify-center flex-wrap gap-6 sm:gap-8">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            const theme = getCategoryStyle(cat, idx);

            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onSelectCategory(cat);
                  scrollToGrid();
                }}
                className="group flex flex-col items-center gap-2.5 w-24 text-center cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-[72px] h-[72px] rounded-full ${theme.bg} ${theme.iconColor} flex items-center justify-center shadow-2xs ring-2 ${
                    isSelected
                      ? 'ring-red-700 bg-red-700 text-white scale-105 shadow-md'
                      : `${theme.ring} group-hover:scale-105 group-hover:ring-red-600/60 group-hover:shadow-sm`
                  } transition-all duration-200`}
                >
                  {theme.icon}
                </div>
                <span
                  className={`text-xs leading-snug tracking-tight transition-colors line-clamp-2 ${
                    isSelected
                      ? 'text-red-700 font-bold'
                      : 'text-slate-700 font-medium group-hover:text-red-700'
                  }`}
                >
                  {cat}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}