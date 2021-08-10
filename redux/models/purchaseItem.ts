import {Currency, RkbProduct} from '../api/productApi';

export type PurchaseItem = {
  type: 'product' | 'rch' | 'sim_card';
  title: string;
  variationId?: string;
  price: Currency;
  qty: number;
  key: string;
  orderItemId?: number;
  sku: string;
  imageUrl?: string;
};

export const createFromProduct = (prod: RkbProduct) => {
  return {
    type: 'product',
    title: prod.name,
    variationId: prod.variationId,
    price: prod.price,
    qty: 1,
    key: prod.uuid,
    sku: prod.sku,
    imageUrl: prod.imageUrl,
  } as PurchaseItem;
};
