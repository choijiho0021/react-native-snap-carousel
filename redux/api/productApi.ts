import _ from 'underscore';
import {Set} from 'immutable';
import {Store} from '@/redux/modules/cart';
import api, {ApiResult} from './api';
import utils from '../utils';
import {createFromProduct} from '../models/purchaseItem';

const category = {
  asia: '64',
  europe: '69',
  usaAu: '65',
  multi: '67',
};

const storeId: Record<Store, number> = {
  kr: 2,
  global: 3,
};

type PromoFlag = 'hot' | 'sale';
const promoFlag: Record<string, PromoFlag> = {
  53: 'hot', // 운용자 추천
  57: 'sale', // 할인
};

const callStatus = {
  OK: 'OK',
  FORBIDDEN: 'Forbidden',
};

const untilConnected = ['CALLING', 'EARLY', 'CONNECTING', 'CONFIRMED'];

type DrupalProduct = {
  uuid: string;
  title: string;
  price: string;
  field_daily: string;
  partner_id: string;
  field_product_categories: string[];
  field_days: string;
  variations: string[];
  field_description: string;
  field_special_categories: string;
  sku: string;
};

export type RkbProduct = {
  key: string;
  uuid: string;
  name: string;
  price: number;
  field_daily: boolean;
  partnerId: string;
  categoryId: string[];
  days: number;
  variationId: string;
  field_description: string;
  promoFlag: PromoFlag[];
  sku: string;
  idx: number;

  // additional
  ccodeStr?: string;
  search?: string;
  pricePerDay?: number;
  cntry?: Set<string>;
  imageUrl?: string;
};

const toPurchaseItem = (prod?: RkbProduct) => {
  return prod ? createFromProduct(prod) : undefined;
};

const toProduct = (data: DrupalProduct[]): ApiResult<RkbProduct> => {
  if (_.isArray(data)) {
    return api.success(
      data.map((item, idx) => ({
        key: item.uuid,
        uuid: item.uuid,
        name: item.title,
        price: utils.stringToNumber(item.price) || 0,
        field_daily: item.field_daily === 'daily',
        partnerId: item.partner_id,
        categoryId: item.field_product_categories,
        days: utils.stringToNumber(item.field_days) || 0,
        variationId: item.variations && item.variations[0],
        field_description: item.field_description,
        promoFlag: item.field_special_categories
          .split(',')
          .map((v) => promoFlag[v.trim()])
          .filter((v) => !_.isEmpty(v)),
        sku: item.sku,
        idx,
      })),
    );
  }

  return api.failure(api.E_NOT_FOUND);
};

type DrupalLocalOp = {
  nid: string;
  body: string;
  title: string;
  field_country: string[];
  field_image: string;
  field_network: string;
  field_apn_setting: string;
  field_weight: string;
};

export type RkbLocalOp = {
  key: string;
  name: string;
  ccode: string[];
  apn: string;
  imageUrl: string;
  network: string;
  weight: number;
  detail: string;
};
const toLocalOp = (data: DrupalLocalOp[]): ApiResult<RkbLocalOp> => {
  if (_.isArray(data)) {
    return api.success(
      data.map((item) => ({
        key: item.nid,
        name: item.title,
        ccode: item.field_country.sort(),
        apn: item.field_apn_setting,
        imageUrl: item.field_image,
        network: item.field_network,
        weight: utils.stringToNumber(item.field_weight) || 0,
        detail: item.body,
      })),
    );
  }

  return api.failure(api.E_NOT_FOUND);
};

const toColumnList = (list: RkbProduct[][]) => {
  const result: {key: string; data: RkbProduct[][]}[] = [];
  list.forEach((elm) => {
    if (result.length > 0 && !result[result.length - 1].data[1]) {
      result[result.length - 1].data[1] = elm;
    } else {
      result.push({
        key: elm[0].uuid,
        data: [elm, undefined],
      });
    }
  });

  return result;
};

const getTitle = (localOp?: RkbLocalOp) => {
  return localOp ? localOp.name.split('-')[0] : '';
};

const getProduct = (store?: Store) => {
  const id = store ? storeId[store] : '';
  return api.callHttpGet(
    api.httpUrl(`${api.path.prodList}${id ? `/${id}` : ''}?_format=hal_json`),
    toProduct,
  );
};

const getProductBySku = (sku: string) => {
  if (_.isEmpty(sku))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: sku');

  return api.callHttpGet<RkbProduct>(
    api.httpUrl(`${api.path.prodSku}/${sku}?_format=hal_json`),
    toProduct,
  );
};

const getLocalOp = (op?: string) => {
  return api.callHttpGet<RkbLocalOp>(
    api.httpUrl(`${api.path.localOp + (op ? `/${op}` : '')}?_format=hal_json`),
    toLocalOp,
  );
};

export default {
  category,
  toPurchaseItem,
  toColumnList,
  getTitle,
  getProduct,
  getProductBySku,
  getLocalOp,
};
