import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/hooks/useCart";

export const metadata: Metadata = {
  title: "AXEVORA // DROP 01: THE MONSOON PROTOCOL",
  description: "Exclusive premium luxury tech-wear & streetwear drop. Water-repellent gear, heavy hoodies, and reflective rainwear engineered for the urban monsoon terrain.",
  keywords: ["axevora", "streetwear", "techwear", "monsoon protocol", "luxury fashion", "qikink fulfillment"],
  authors: [{ name: "AXEVORA" }],
  openGraph: {
    title: "AXEVORA // DROP 01: THE MONSOON PROTOCOL",
    description: "Exclusive premium luxury tech-wear & streetwear drop.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-crimson selection:text-white">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
