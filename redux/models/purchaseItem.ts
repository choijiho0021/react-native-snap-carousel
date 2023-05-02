import {utils} from '@/utils/utils';
import {Currency, RkbAddOnProd, RkbProduct} from '../api/productApi';

export type PurchaseItem = {
  type: 'addon' | 'product' | 'rch' | 'sim_card';
  title: string;
  variationId?: string;
  price: Currency;
  qty: number;
  key: string;
  orderItemId?: number;
  sku: string;
  imageUrl?: string;
  subsId?: string;
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

export const createFromAddOnProduct = (prod: RkbAddOnProd, subsId: string) => {
  return {
    type: 'addon',
    title: prod.title,
    price: utils.stringToCurrency(prod.price),
    qty: 1,
    key: prod.id,
    sku: prod.sku,
    subsId,
  } as PurchaseItem;
};
