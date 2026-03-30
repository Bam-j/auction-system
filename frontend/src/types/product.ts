export type ProductType = 'FIXED' | 'AUCTION';
export type ProductStatus = 'ACTIVE' | 'SOLD_OUT' | 'INSTANT_BUY' | 'CLOSED' | string;

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  type: ProductType;
  status: ProductStatus;
  price: number;
  priceUnit: string;
  imageUrl: string | null;
  seller: string;
  stock?: number | null;
  endedAt?: string | null;
  startPrice?: number;
  minBidIncrement?: number;
  instantPurchasePrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchParams {
  category?: string;
  searchType?: string;
  saleMethod?: string;
  keyword?: string;
  [key: string]: any;
}
