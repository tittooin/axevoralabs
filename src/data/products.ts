export interface Product {
  id: string;
  name: string;
  category: 'tshirt' | 'hoodie' | 'raincoat';
  categoryLabel: string;
  price: number;
  sku: string;
  image: string;
  description: string;
  details: string[];
  scarcityText: string;
  sizes: string[];
  colors: string[];
  specifications: {
    fabric: string;
    weight: string;
    waterproofing?: string;
    hardware?: string;
    origin: string;
  };
}

export const products: Product[] = [];
