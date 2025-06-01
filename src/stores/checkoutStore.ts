import { create } from 'zustand';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

export type PaymentMethod = 'cod' | 'installment';

interface CheckoutState {
  shippingAddress: ShippingAddress | null;
  selectedShippingRate: ShippingRate | null;
  paymentMethod: PaymentMethod | null;
  setShippingAddress: (address: ShippingAddress) => void;
  setShippingRate: (rate: ShippingRate) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  calculateTax: (subtotal: number) => number;
  getShippingRates: (country: string, state: string) => Promise<ShippingRate[]>;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  shippingAddress: null,
  selectedShippingRate: null,
  paymentMethod: null,
  
  setShippingAddress: (address) => {
    set({ shippingAddress: address });
  },
  
  setShippingRate: (rate) => {
    set({ selectedShippingRate: rate });
  },
  
  setPaymentMethod: (method) => {
    set({ paymentMethod: method });
  },
  
  calculateTax: (subtotal: number) => {
    const { shippingAddress } = get();
    if (!shippingAddress) return 0;
    
    // Example tax rates by country
    const taxRates: Record<string, number> = {
      US: 0.0725, // 7.25%
      CA: 0.13,   // 13%
      UK: 0.20,   // 20%
      // Add more countries as needed
    };
    
    const taxRate = taxRates[shippingAddress.country] || 0;
    return subtotal * taxRate;
  },
  
  getShippingRates: async (country: string, state: string) => {
    // Example shipping rates calculation
    const baseRates: Record<string, ShippingRate[]> = {
      US: [
        { id: 'us-standard', name: 'Standard Shipping', price: 5.99, estimatedDays: '5-7 business days' },
        { id: 'us-express', name: 'Express Shipping', price: 15.99, estimatedDays: '2-3 business days' },
        { id: 'us-overnight', name: 'Overnight Shipping', price: 29.99, estimatedDays: '1 business day' },
      ],
      CA: [
        { id: 'ca-standard', name: 'Standard Shipping', price: 7.99, estimatedDays: '7-10 business days' },
        { id: 'ca-express', name: 'Express Shipping', price: 19.99, estimatedDays: '3-5 business days' },
      ],
      // Add more countries as needed
    };
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return baseRates[country] || [];
  },
  
  reset: () => {
    set({
      shippingAddress: null,
      selectedShippingRate: null,
      paymentMethod: null,
    });
  },
}));