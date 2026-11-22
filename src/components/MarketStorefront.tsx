"use client";

import React, { useState, useMemo } from "react";
import SiteFooter from "./SiteFooter";
import {
  Search,
  ShoppingBasket,
  Plus,
  Minus,
  X,
  CheckCircle2,
  FileDown,
  Truck,
  Sparkles,
  Store,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";
import HeroCarousel from "./HeroCarousel";
import CategoryProductRows from "./CategoryProductRows";
import type { OdooProduct } from "@/lib/odoo";
import SiteHeader from "./SiteHeader";
interface CartItem extends OdooProduct {
  quantity: number;
}
import CategoryBubbleStrip from "./CategoryBubbleStrip";

export default function MarketStorefront({
  initialProducts,
  dataSource = "odoo",
  dataWarning,
}: {
  initialProducts: OdooProduct[];
  dataSource?: "odoo" | "fallback";
  dataWarning?: string;
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderNumber: string;
    pdfBase64: string;
    emailSent: boolean;
  } | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(initialProducts.map((p) => p.category)));
    return ["All", ...unique];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchesCat =
        selectedCategory === "All" || p.category === selectedCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [initialProducts, selectedCategory, search]);

  const cartItems: CartItem[] = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, quantity]) => {
        const product = initialProducts.find((p) => p.id === Number(id))!;
        return { ...product, quantity };
      })
      .filter(Boolean);
  }, [cart, initialProducts]);

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => {
      const next = (prev[id] || 0) + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { fullName, phone, email, address, notes },
          items: cartItems,
          total: totalAmount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      setOrderResult({
        orderNumber: data.orderNumber,
        pdfBase64: data.pdfBase64,
        emailSent: Boolean(data.emailSent),
      });
      setCart({});
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const downloadPdf = () => {
    if (!orderResult) return;
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${orderResult.pdfBase64}`;
    link.download = `CountryBazaar-Order-${orderResult.orderNumber}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Top Promo Strip */}
      <div className="bg-red-800 text-white text-xs py-2 px-4 text-center font-semibold tracking-wide">
        <span className="inline-flex items-center gap-2">
          <Truck className="w-4 h-4 text-amber-300" />
          Country Bazaar Midrand • Order Online
        </span>
      </div>

      {/* Main Header */}
      <SiteHeader
        products={initialProducts}
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        onSelectCategory={setSelectedCategory}
        onAddToCart={updateQty}
        totalCount={totalCount}
        totalAmount={totalAmount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCheckout={() => {
          setOrderResult(null);
          setIsCheckoutOpen(true);
        }}
      />

      <CategoryBubbleStrip
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <HeroCarousel
        categories={categories}
        onSelectCategory={setSelectedCategory}
      />

      {/* Fallback Notice if Odoo isn't connected yet */}
      {dataSource === "fallback" && dataWarning && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="rounded-xl bg-amber-50 border border-amber-300 px-4 py-2.5 text-xs text-amber-950 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{dataWarning}</span>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <CategoryProductRows
        products={initialProducts}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        search={search}
        onClearSearch={() => setSearch("")}
        cart={cart}
        onUpdateQty={updateQty}
        dataSource={dataSource}
        dataWarning={dataWarning}
      />

      {/* Slide-over Basket Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBasket className="w-5 h-5 text-emerald-900" />
                <h3 className="font-extrabold text-lg">
                  Your Basket ({totalCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-stone-400">
                  <ShoppingBasket className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Your basket is currently empty.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/70"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-stone-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-500">
                        R {item.price.toFixed(2)} / {item.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="w-20 text-right font-bold text-sm text-emerald-950">
                      R {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
                <div className="flex items-center justify-between text-base font-extrabold">
                  <span>Estimated Total</span>
                  <span className="text-emerald-950 text-xl">
                    R {totalAmount.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setOrderResult(null);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Continue to Order Summary
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout / Order Submission Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {orderResult ? (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                <h3 className="text-2xl font-extrabold text-stone-900">
                  Order Slip Ready!
                </h3>
                <p className="text-sm text-stone-600">
                  Order{" "}
                  <span className="font-bold text-emerald-950">
                    #{orderResult.orderNumber}
                  </span>{" "}
                  has been recorded and its PDF summary is ready to download.
                  {orderResult.emailSent
                    ? " Email notification was also sent."
                    : ""}
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={downloadPdf}
                    className="inline-flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-3 rounded-xl transition cursor-pointer"
                  >
                    <FileDown className="w-5 h-5" /> Download Order PDF
                  </button>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-5 py-3 rounded-xl border border-stone-300 font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Back to Market
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-emerald-950">
                    Submit Order Request
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    No online payment required. Generates a printable PDF order
                    slip immediately.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+27 82 000 0000"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Delivery Address *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        required
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street address, suburb, Midrand"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Gate code, preferred delivery window..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-950">
                    Order Total ({totalCount} items)
                  </span>
                  <span className="text-lg font-extrabold text-emerald-950">
                    R {totalAmount.toFixed(2)}
                  </span>
                </div>

                <button
                  disabled={submitting}
                  type="submit"
                  className="w-full py-3.5 bg-emerald-900 hover:bg-emerald-950 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  {submitting ? "Generating PDF Slip..." : "Generate Order PDF"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      <SiteFooter
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCheckout={() => {
          setOrderResult(null);
          setIsCheckoutOpen(true);
        }}
        onResetFilters={() => {
          setSelectedCategory("All");
          setSearch("");
        }}
      />
    </div>
  );
}
