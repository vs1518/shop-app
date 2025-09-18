export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  qty: number;
}

export interface Address {
  line1: string; line2?: string; city: string; postalCode: string; country: string;
}

export interface Order {
  id: string;
  userId: string;
  email: string;
  phone?: string;
  items: OrderItem[];
  total: number;
  address: Address;
  createdAt: string;
  status: 'paid' | 'pending' | 'cancelled';
}
