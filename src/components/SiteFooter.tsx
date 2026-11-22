"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

interface SiteFooterProps {
  onOpenCart: () => void;
  onOpenCheckout: () => void;
  onResetFilters: () => void;
}

const OPENING_HOURS = [
  { label: "Monday – Friday", hours: "08:00 – 19:00" },
  { label: "Saturday", hours: "08:00 – 18:00" },
  { label: "Sunday", hours: "08:30 – 16:00" },
  { label: "Public Holidays", hours: "08:30 – 16:00" },
];

export default function SiteFooter({
  onOpenCart,
  onOpenCheckout,
  onResetFilters,
}: SiteFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-12 bg-white border-t border-stone-200 text-stone-600">
      {/* Main 4-Column Footer Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Contact */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-amber-600 tracking-tight">
                Contact
              </h3>
              <span className="block w-6 h-0.5 bg-amber-500 mt-1.5 rounded-full" />
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <p className="font-semibold text-stone-700">Address</p>
                <p className="text-stone-500 mt-0.5">
                  Midrand, Gauteng, South Africa
                </p>
              </div>

              <div>
                <p className="font-semibold text-stone-700">Phone</p>
                <a
                  href="tel:+27835835600"
                  className="block text-stone-500 hover:text-amber-600 transition mt-0.5 tabular-nums"
                >
                  +27 83 583 5600
                </a>
              </div>

              <div>
                <p className="font-semibold text-stone-700">E-Mail</p>
                <a
                  href="mailto:info@countrybazaarsouthafrica.co.za"
                  className="block text-stone-500 hover:text-amber-600 transition mt-0.5 break-all"
                >
                  info@countrybazaarsouthafrica.co.za
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: My Account & Mobile App */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-amber-600 tracking-tight">
                  My Order
                </h3>
                <span className="block w-6 h-0.5 bg-amber-500 mt-1.5 rounded-full" />
              </div>

              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={onOpenCart}
                    className="text-stone-500 hover:text-amber-600 transition cursor-pointer"
                  >
                    My Basket
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Corporate & WhatsApp Channel */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-amber-600 tracking-tight">
                  Corporate
                </h3>
                <span className="block w-6 h-0.5 bg-amber-500 mt-1.5 rounded-full" />
              </div>

              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={scrollToTop}
                    className="text-stone-500 hover:text-amber-600 transition cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <a
                    href="tel:+27835835600"
                    className="text-stone-500 hover:text-amber-600 transition"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <h4 className="text-sm font-bold text-amber-600 tracking-tight">
                  WhatsApp Channel
                </h4>
                <span className="block w-6 h-0.5 bg-amber-500 mt-1.5 rounded-full" />
              </div>

              <a
                href="https://whatsapp.com/channel/0029Vb6C5TI3mFYFQfqOrv3f"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg border border-emerald-200 hover:border-emerald-500 bg-emerald-50/50 transition"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600/15" />
                <div className="leading-tight">
                  <span className="block text-xs font-bold text-emerald-700">
                    WhatsApp
                  </span>
                  <span className="block text-[10px] text-stone-500">
                    Chat With Us
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Column 4: Opening Hours */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-amber-600 tracking-tight">
                Opening Hours
              </h3>
              <span className="block w-6 h-0.5 bg-amber-500 mt-1.5 rounded-full" />
            </div>

            <div className="space-y-2 text-xs">
              {OPENING_HOURS.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-2 items-center gap-2 py-0.5"
                >
                  <span className="font-semibold text-stone-600 truncate">
                    {row.label}
                  </span>
                  <span className="text-stone-400 tabular-nums text-right sm:text-left">
                    {row.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Golden Copyright & Payment Badges Bar */}
      <div className="bg-amber-500 text-stone-950">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
            &copy; 2026 COUNTRY BAZAAR SOUTH AFRICA — ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}
