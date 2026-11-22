import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Country Bazaar South Africa | Midrand Market",
  description:
    "Fresh groceries, everyday market essentials, and quick order PDF slips in Rand (R) from Country Bazaar Midrand.",
  icons: {
    icon: [
      {
        url: "/images/country-bazaar-logo.jpeg",
        type: "image/jpeg",
      },
    ],
    shortcut: "/images/country-bazaar-logo.jpeg",
    apple: "/images/country-bazaar-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased bg-stone-50 text-stone-900 selection:bg-amber-300 selection:text-stone-950">
        {children}
      </body>
    </html>
  );
}
