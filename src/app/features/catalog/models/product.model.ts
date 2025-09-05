export interface Product {
  id: string;
  name: string;
  price: number; // en euros
  imageUrl: string;
  rating: number; // 0..5
  tags?: string[];
}
