"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  ShoppingBasket,
  Headphones,
  Store,
  MapPin,
  FileText,
  ChevronDown,
  Plus,
} from "lucide-react";
import type { OdooProduct } from "@/lib/odoo";

interface SiteHeaderProps {
  products: OdooProduct[];
  search: string;
  onSearchChange: (val: string) => void;
  categories: string[];
  onSelectCategory: (cat: string) => void;
  onAddToCart: (id: number, delta: number) => void;
  totalCount: number;
  totalAmount: number;
  onOpenCart: () => void;
  onOpenCheckout: () => void;
}

export default function SiteHeader({
  products,
  search,
  onSearchChange,
  categories,
  onSelectCategory,
  onAddToCart,
  totalCount,
  totalAmount,
  onOpenCart,
  onOpenCheckout,
}: SiteHeaderProps) {
  const [logoError, setLogoError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 85);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const query = search.trim().toLowerCase();

  const matchingProducts = useMemo(() => {
    if (!query) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.barcode && p.barcode.toLowerCase().includes(query)),
    );
  }, [products, query]);

  const previewProducts = matchingProducts.slice(0, 6);

  const matchingCategories = useMemo(() => {
    if (!query) return [];
    const fromProducts = matchingProducts.map((p) => p.category);
    const fromCats = categories.filter(
      (c) => c !== "All" && c.toLowerCase().includes(query),
    );
    return Array.from(new Set([...fromProducts, ...fromCats])).slice(0, 5);
  }, [matchingProducts, categories, query]);

  const scrollToGrid = () => {
    setIsDropdownOpen(false);
    const gridEl = document.getElementById("products-grid");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToGrid();
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-amber-200/80"
          : "bg-white shadow-2xs border-b border-stone-200/90"
      }`}
    >
      {/* Top Utility Bar (Collapses smoothly when scrolling down) */}
      {!isScrolled && (
        <div className="bg-amber-50/70 border-b border-dashed border-amber-200/80 text-[12px] text-slate-900">
          <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center flex-wrap gap-4 sm:gap-6">
              <a
                href="tel:+27835835600"
                className="inline-flex items-center gap-1.5 hover:text-amber-700 transition font-medium"
              >
                <Headphones className="w-3.5 h-3.5 text-amber-600" />
                <span>Customer Care: +27 83 583 5600</span>
              </a>
              <span className="hidden sm:inline text-amber-300">|</span>
              <button
                type="button"
                onClick={() => {
                  onSelectCategory("All");
                  setIsDropdownOpen(false);
                }}
                className="inline-flex items-center gap-1.5 hover:text-amber-700 transition font-medium cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-emerald-900" />
                <span>Country Bazaar Midrand</span>
              </button>
              <span className="hidden md:inline text-amber-300">|</span>
              <span className="hidden md:inline-flex items-center gap-1.5 text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Midrand, South Africa</span>
              </span>
            </div>

            {/* Right Social Links */}
            <div className="flex items-center gap-3 text-slate-500">
              <a
                href="https://www.instagram.com/countrybazaarsouthafrica/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-amber-600 transition"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5Zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm5.5-2.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Logo + Search + Action Buttons Row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-4 sm:gap-6">
        {/* Logo */}
        <button
          type="button"
          onClick={() => {
            onSelectCategory("All");
            onSearchChange("");
            setIsDropdownOpen(false);
          }}
          className="flex items-center gap-2.5 shrink-0 cursor-pointer text-left"
        >
          {!logoError ? (
            <img
              src="/images/country-bazaar-logo.jpeg"
              alt="Country Bazaar"
              onError={() => setLogoError(true)}
              className={`w-auto max-w-[220px] object-contain rounded-lg transition-all duration-200 ${
                isScrolled ? "h-12 sm:h-14" : "h-16 sm:h-20 md:h-[84px]"
              }`}
            />
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-extrabold text-lg shadow-2xs">
                CB
              </div>
              <div>
                <span className="block text-lg font-extrabold tracking-tight text-emerald-950 leading-none">
                  COUNTRY BAZAAR
                </span>
                <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-0.5">
                  Midrand Market
                </span>
              </div>
            </div>
          )}
        </button>

        {/* Search Box + Live Results Dropdown */}
        <div ref={searchWrapperRef} className="flex-1 max-w-2xl relative">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsDropdownOpen(true);
                }}
                placeholder="Type the product or keyword you are looking for..."
                className="w-full pl-4 pr-14 py-2.5 bg-white border border-stone-300 border-r-0 rounded-l-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange("");
                    setIsDropdownOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-r-lg border border-amber-500 hover:border-amber-600 inline-flex items-center gap-2 transition cursor-pointer shrink-0 shadow-2xs"
            >
              <Search className="w-4 h-4" />
              <span>SEARCH</span>
            </button>
          </form>

          {/* Dropdown Panel */}
          {isDropdownOpen && query.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-amber-200/80 shadow-2xl z-50 p-3.5 space-y-3">
              {previewProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-0.5">
                    {previewProducts.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2.5 p-2 rounded-xl border border-stone-200/80 hover:border-amber-500 bg-white transition"
                      >
                        <button
                          type="button"
                          onClick={scrollToGrid}
                          className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-lg bg-stone-100 shrink-0 flex items-center justify-center overflow-hidden">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-extrabold text-emerald-900/40">
                                {item.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-stone-900 line-clamp-2 leading-snug">
                              {item.name}
                            </p>
                            <span className="inline-block mt-1 bg-amber-400 text-stone-950 font-extrabold text-xs px-2 py-0.5 rounded-md tabular-nums">
                              R {item.price.toFixed(2)}
                            </span>
                          </div>
                        </button>

                        <button
                          type="button"
                          title="Add to basket"
                          onClick={() => onAddToCart(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white flex items-center justify-center shrink-0 transition cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={scrollToGrid}
                    className="w-full py-2 rounded-lg border border-amber-500 text-amber-900 bg-amber-50/60 hover:bg-amber-500 hover:text-stone-950 font-bold text-xs transition cursor-pointer"
                  >
                    Show All ({matchingProducts.length})
                  </button>
                </>
              ) : (
                <p className="text-xs text-stone-500 py-4 text-center">
                  No matching products found for &ldquo;{search}&rdquo;.
                </p>
              )}

              {matchingCategories.length > 0 && (
                <div className="pt-2.5 border-t border-stone-100">
                  <p className="text-xs font-extrabold text-stone-800 mb-1.5">
                    Categories
                  </p>
                  <div className="flex flex-col gap-1">
                    {matchingCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          onSelectCategory(cat);
                          scrollToGrid();
                        }}
                        className="text-left text-xs text-stone-600 hover:text-amber-700 font-medium py-0.5 transition cursor-pointer"
                      >
                        Country Bazaar &gt; {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Buttons: Order PDF & Basket */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-amber-300 hover:border-amber-500 bg-white text-xs sm:text-sm font-semibold text-stone-900 transition cursor-pointer"
          >
            <ShoppingBasket className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">My Basket</span>
            <span className="bg-amber-500 text-stone-950 text-xs font-extrabold px-2 py-0.5 rounded-full tabular-nums">
              {totalCount}
            </span>
            {totalCount > 0 && (
              <span className="hidden xl:inline font-extrabold text-emerald-950 tabular-nums">
                R {totalAmount.toFixed(2)}
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
