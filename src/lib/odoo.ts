import { connection } from "next/server";

export interface OdooProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  unit: string;
  inStock: boolean;
  qtyAvailable: number;
  imageUrl: string | null;
  barcode?: string;
}

let rpcCounter = 1;

async function odooRpc(
  url: string,
  service: string,
  method: string,
  args: unknown[],
) {
  rpcCounter = (rpcCounter + 1) % 1000000;

  const response = await fetch(`${url}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: { service, method, args },
      id: rpcCounter,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Odoo HTTP error: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(
      data.error.data?.message || data.error.message || "Odoo RPC Error",
    );
  }
  return data.result;
}

export async function getOdooProducts(): Promise<{
  products: OdooProduct[];
  source: "odoo" | "fallback";
  errorMessage?: string;
}> {
  await connection();

  const url = process.env.ODOO_URL?.trim();
  const db = process.env.ODOO_DB?.trim();
  const username = process.env.ODOO_USERNAME?.trim();
  const apiKey = process.env.ODOO_API_KEY?.trim();
  const companyId = Number(process.env.ODOO_COMPANY_ID || 4);

  if (!url || !db || !username || !apiKey) {
    return {
      products: getMockProducts(),
      source: "fallback",
      errorMessage:
        "Odoo environment variables are incomplete; showing sample market catalogue.",
    };
  }

  try {
    const uid = await odooRpc(url, "common", "authenticate", [
      db,
      username,
      apiKey,
      {},
    ]);
    if (!uid) {
      throw new Error(
        "Odoo authentication failed. Check ODOO_USERNAME, ODOO_API_KEY, and ODOO_DB.",
      );
    }

    const domain: unknown[] = [
      ["sale_ok", "=", true],
      ["active", "=", true],
    ];

    if (companyId > 0) {
      domain.push(["company_id", "in", [false, companyId]]);
    }

    const records = await odooRpc(url, "object", "execute_kw", [
      db,
      uid,
      apiKey,
      "product.template",
      "search_read",
      [domain],
      {
        fields: [
          "id",
          "name",
          "list_price",
          "categ_id",
          "uom_id",
          "qty_available",
          "image_256",
          "barcode",
        ],
        limit: 300,
        context:
          companyId > 0
            ? { allowed_company_ids: [companyId], company: companyId }
            : {},
      },
    ]);

    const mapped: OdooProduct[] = (records || []).map((item: any) => {
      const qty = Number(item.qty_available ?? 0);
      return {
        id: item.id,
        name: item.name,
        price: Number(item.list_price || 0),
        category: Array.isArray(item.categ_id)
          ? String(item.categ_id[1]).split("/").pop()?.trim() || "General"
          : "General",
        unit: Array.isArray(item.uom_id) ? item.uom_id[1] : "Unit",
        qtyAvailable: qty,
        inStock: qty > 0,
        imageUrl: item.image_256
          ? `data:image/png;base64,${item.image_256}`
          : null,
        barcode: item.barcode || undefined,
      };
    });

    return {
      products: mapped,
      source: "odoo",
    };
  } catch (error: any) {
    console.error("Odoo fetch error:", error);
    return {
      products: getMockProducts(),
      source: "fallback",
      errorMessage: error?.message || "Could not reach Odoo catalog.",
    };
  }
}

function getMockProducts(): OdooProduct[] {
  return [
    {
      id: 1,
      name: "Farm Fresh Free-Range Eggs (18 Pack)",
      price: 64.99,
      category: "Dairy & Eggs",
      unit: "Pack",
      qtyAvailable: 45,
      inStock: true,
      imageUrl: null,
    },
    {
      id: 2,
      name: "Organic Hass Avocados (4 Pack)",
      price: 49.99,
      category: "Fresh Produce",
      unit: "Pack",
      qtyAvailable: 30,
      inStock: true,
      imageUrl: null,
    },
    {
      id: 3,
      name: "Artisanal Sourdough Loaf",
      price: 38.5,
      category: "Bakery",
      unit: "Loaf",
      qtyAvailable: 20,
      inStock: true,
      imageUrl: null,
    },
    {
      id: 4,
      name: "Karoo Lamb Chops (500g)",
      price: 119.0,
      category: "Butchery",
      unit: "500g",
      qtyAvailable: 18,
      inStock: true,
      imageUrl: null,
    },
    {
      id: 5,
      name: "Raw Fynbos Honey (500g)",
      price: 89.0,
      category: "Pantry",
      unit: "Jar",
      qtyAvailable: 25,
      inStock: true,
      imageUrl: null,
    },
    {
      id: 6,
      name: "Full Cream Farm Milk (2L)",
      price: 34.99,
      category: "Dairy & Eggs",
      unit: "2L",
      qtyAvailable: 60,
      inStock: true,
      imageUrl: null,
    },
    {
      id: 7,
      name: "Beef Biltong Sliced (250g)",
      price: 95.0,
      category: "Butchery",
      unit: "250g",
      qtyAvailable: 15,
      inStock: true,
      imageUrl: null,
    },
    {
      id: 8,
      name: "Sweet Pink Lady Apples (1.5kg)",
      price: 39.99,
      category: "Fresh Produce",
      unit: "Bag",
      qtyAvailable: 40,
      inStock: true,
      imageUrl: null,
    },
  ];
}
