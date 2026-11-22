import React, { Suspense } from "react";
import { getOdooProducts } from "@/lib/odoo";
import MarketStorefront from "@/components/MarketStorefront";

async function StorefrontLoader() {
  const { products, source, errorMessage } = await getOdooProducts();
  return (
    <MarketStorefront
      initialProducts={products}
      dataSource={source}
      dataWarning={errorMessage}
    />
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-emerald-950">
              Loading Country Bazaar catalogue...
            </p>
          </div>
        </div>
      }
    >
      <StorefrontLoader />
    </Suspense>
  );
}
