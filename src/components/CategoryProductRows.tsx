"use client";

import React, { useRef, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ShoppingBasket,
  RotateCcw,
  Sprout,
  Beef,
  Croissant,
  Milk,
  Coffee,
  Snowflake,
  Cookie,
  Wheat,
  Flame,
  Apple,
  Wine,
  Home,
  Package,
} from "lucide-react";
import type { OdooProduct } from "@/lib/odoo";

interface CategoryProductRowsProps {
  products: OdooProduct[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  search: string;
  onClearSearch: () => void;
  cart: Record<number, number>;
  onUpdateQty: (id: number, delta: number) => void;
  dataSource: "odoo" | "fallback";
  dataWarning?: string;
}

function getCategoryBannerIcon(categoryName: string) {
  const key = categoryName.toLowerCase();

  if (
    key.includes("produce") ||
    key.includes("fruit") ||
    key.includes("veg") ||
    key.includes("fresh")
  ) {
    return key.includes("fruit") ? (
      <Apple className="w-8 h-8 text-emerald-950 stroke-[1.8]" />
    ) : (
      <Sprout className="w-8 h-8 text-emerald-950 stroke-[1.8]" />
    );
  }
  if (
    key.includes("meat") ||
    key.includes("butcher") ||
    key.includes("beef") ||
    key.includes("lamb") ||
    key.includes("poultry")
  ) {
    return <Beef className="w-8 h-8 text-emerald-950 stroke-[1.8]" />;
  }
  if (key.includes("bak") || key.includes("bread") || key.includes("pastry")) {
    return <Croissant className="w-8 h-8 text-emerald-950 stroke-[1.8]" />;
  }
  if (
    key.includes("dairy") ||
    key.includes("milk") ||
    key.includes("cheese") ||
    key.includes("egg")
  ) {
    return <Milk className="w-8 h-8 text-emerald-950 stroke-[1.8]" />;
  }
  if (
    key.includes("beverage") ||
    key.includes("drink") ||
    key.includes("coffee") ||
    key.includes("tea")
  ) {
    return key.includes("wine") || key.includes("juice") ? (
      <Wine className="w-8 h-8 text-emerald-950 stroke-[1.8]" />
    ) : (
      <Coffee className="w-8 h-8 text-emerald-950 stroke-[1.8]" />
    );
  }
  if (key.includes("frozen") || key.includes("cold") || key.includes("ice")) {
    return <Snowflake className="w-8 h-8 text-emerald-950 stroke-[1.8]" />;
  }
  if (
    key.includes("snack") ||
    key.includes("biscuit") ||
    key.includes("sweet") ||
    key.includes("chocolate")
  ) {
    return <Cookie className="w-8 h-8 text-emerald-950 stroke-[1.8]" />;
  }
  if (
    key.includes("grain") ||
    key.includes("flour") ||
    key.includes("rice") ||
    key.includes("spice")
  ) {
    return key.includes("spice") || key.includes("bbq") ? (
      <Flame className="w-8 h-8 text-emerald-950 stroke-[1.8]" />
    ) : (
      <Wheat className="w-8 h-8 text-emerald-950 stroke-[1.8]" />
    );
  }
  if (
    key.includes("clean") ||
    key.includes("home") ||
    key.includes("household")
  ) {
    return <Home className="w-8 h-8 text-emerald-950 stroke-[1.8]" />;
  }
  if (
    key.includes("pantry") ||
    key.includes("grocery") ||
    key.includes("food")
  ) {
    return <ShoppingBasket className="w-8 h-8 text-emerald-950 stroke-[1.8]" />;
  }

  return <Package className="w-8 h-8 text-emerald-950 stroke-[1.8]" />;
}

interface CategoryBannerStripProps {
  categoryName: string;
  items: OdooProduct[];
  cart: Record<number, number>;
  onUpdateQty: (id: number, delta: number) => void;
  onToggleCategoryFocus: (cat: string) => void;
  isSingleCategoryView: boolean;
}

function CategoryBannerStrip({
  categoryName,
  items,
  cart,
  onUpdateQty,
  onToggleCategoryFocus,
  isSingleCategoryView,
}: CategoryBannerStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const slideTrack = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.max(320, Math.floor(el.clientWidth * 0.75));
    el.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  if (items.length === 0) return null;

  return (
    <div
      id={`category-${encodeURIComponent(categoryName.toLowerCase())}`}
      className="space-y-3.5"
    >
      {/* Category Banner */}
      <div className="relative h-24 sm:h-28 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-4 sm:px-7 flex items-center justify-between gap-4 shadow-2xs border border-amber-600/20 overflow-hidden">
        {/* Left Arrow Controls */}

        {/* Center Category Title & Action Pill */}
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 min-w-0">
          <h2 className="text-lg sm:text-2xl md:text-[28px] font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] truncate max-w-full">
            {categoryName}
          </h2>
          <button
            type="button"
            onClick={() =>
              onToggleCategoryFocus(isSingleCategoryView ? "All" : categoryName)
            }
            className="mt-1.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider px-4 py-1 rounded-full shadow-2xs transition cursor-pointer"
          >
            {isSingleCategoryView
              ? "ALL CATEGORIES"
              : `SHOW ${items.length} ITEMS`}
          </button>
        </div>

        {/* Right Category Icon Badge */}
      </div>

      {/* Horizontal Scrolling Products */}
      <div className="relative">
        <button
          type="button"
          onClick={() => slideTrack("left")}
          aria-label={`Previous ${categoryName} items`}
          className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white hover:bg-amber-50 text-stone-900 border border-stone-200 shadow-md items-center justify-center transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => slideTrack("right")}
          aria-label={`Next ${categoryName} items`}
          className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white hover:bg-amber-50 text-stone-900 border border-stone-200 shadow-md items-center justify-center transition cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={trackRef}
          className="flex items-stretch gap-3.5 overflow-x-auto scroll-smooth pb-2 px-0.5"
        >
          {items.map((product) => {
            const qtyInCart = cart[product.id] || 0;

            return (
              <div
                key={product.id}
                className="w-48 sm:w-52 shrink-0 bg-white rounded-2xl border border-stone-200/90 hover:border-amber-500 p-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
              >
                <div>
                  <div className="h-36 sm:h-40 w-full rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center overflow-hidden mb-3">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-stone-400 gap-1">
                        <ShoppingBasket className="w-7 h-7 stroke-[1.6]" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          {product.name.slice(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2 leading-snug min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Unit: {product.unit}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 space-y-2.5">
                  <span className="inline-block bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm px-2.5 py-1 rounded-lg tabular-nums">
                    R {product.price.toFixed(2)}
                  </span>

                  {qtyInCart > 0 ? (
                    <div className="flex items-center justify-between bg-emerald-950 text-white rounded-xl px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(product.id, -1)}
                        aria-label="Remove one"
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-extrabold">
                        {qtyInCart}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(product.id, 1)}
                        aria-label="Add one more"
                        className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onUpdateQty(product.id, 1)}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Basket</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CategoryProductRows({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  search,
  onClearSearch,
  cart,
  onUpdateQty,
  dataSource,
  dataWarning,
}: CategoryProductRowsProps) {
  const normalizedQuery = search.trim().toLowerCase();

  const matchingProducts = useMemo(() => {
    if (!normalizedQuery) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(normalizedQuery) ||
        p.category.toLowerCase().includes(normalizedQuery) ||
        (p.barcode && p.barcode.toLowerCase().includes(normalizedQuery)),
    );
  }, [products, normalizedQuery]);

  const categoriesToRender = useMemo(() => {
    const ordered = Array.from(
      new Set([
        ...categories.filter((c) => c !== "All"),
        ...matchingProducts.map((p) => p.category),
      ]),
    );

    if (selectedCategory && selectedCategory.toLowerCase() !== "all") {
      return ordered.filter(
        (c) => c.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    return ordered;
  }, [categories, matchingProducts, selectedCategory]);

  const visibleProductCount = useMemo(() => {
    return categoriesToRender.reduce((total, cat) => {
      const count = matchingProducts.filter(
        (p) => p.category.toLowerCase() === cat.toLowerCase(),
      ).length;
      return total + count;
    }, 0);
  }, [categoriesToRender, matchingProducts]);

  const isSingleCategoryView = Boolean(
    selectedCategory && selectedCategory.toLowerCase() !== "all",
  );

  return (
    <section
      id="products-grid"
      className="max-w-7xl mx-auto px-4 py-6 space-y-8"
    >
      {/* Status & Filter Reset Strip */}

      {/* Category Banner + Horizontal Product Rows */}
      {visibleProductCount > 0 ? (
        <div className="space-y-9">
          {categoriesToRender.map((cat) => {
            const items = matchingProducts.filter(
              (p) => p.category.toLowerCase() === cat.toLowerCase(),
            );
            return (
              <CategoryBannerStrip
                key={cat}
                categoryName={cat}
                items={items}
                cart={cart}
                onUpdateQty={onUpdateQty}
                onToggleCategoryFocus={onSelectCategory}
                isSingleCategoryView={isSingleCategoryView}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-3">
          <p className="text-base font-bold text-stone-800">
            No products found.
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectCategory("All");
              onClearSearch();
            }}
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </section>
  );
}
