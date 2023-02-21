/* eslint-disable no-param-reassign */
import _ from 'underscore';
import {Set} from 'immutable';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import utils from '@/redux/api/utils';
import {createFromProduct} from '@/redux/models/purchaseItem';
import api, {ApiResult} from './api';
import {RkbPriceInfo} from '../modules/product';
import {colors} from '@/constants/Colors';
import Env from '@/environment';

const {specialCategories} = Env.get();

export type TabViewRouteKey = 'asia' | 'europe' | 'usaAu' | 'multi';
export type TabViewRoute = {
  key: TabViewRouteKey;
  title: string;
  category: string;
};
export type ProductByCategory = {
  key: string;
  data: RkbProduct[][];
};

const category = {
  asia: '64',
  europe: '69',
  usaAu: '65',
  multi: '67',
};

const flagColor = {
  hot: {
    backgroundColor: colors.veryLightPink,
    fontColor: colors.tomato,
  },
  sizeup: {
    backgroundColor: colors.veryLightBlue,
    fontColor: colors.clearBlue,
  },
  doubleSizeup: {
    backgroundColor: colors.lightSage,
    fontColor: colors.shamrock,
  },
};

export const getPromoFlagColor = (key: string) => {
  return (
    flagColor[key] || {
      backgroundColor: colors.veryLightPink,
      fontColor: colors.tomato,
    }
  );
};

type DrupalProduct = {
  uuid: string;
  title: string;
  price: string;
  field_daily: string;
  field_data_volume: string;
  partner_id: string;
  field_product_categories: string[];
  field_days: string;
  variations: string[];
  field_description: string;
  field_special_categories: string;
  body: string;
  field_hotspot: string;
  field_weight: string;
  field_desc: string;
  sku: string;
};

export type CurrencyCode = 'KRW' | 'USD';
export type Currency = {
  value: number;
  currency: CurrencyCode;
};
export type RkbProduct = {
  key: string;
  uuid: string;
  name: string;
  price: Currency;
  listPrice: Currency;
  field_daily: string;
  volume: string;
  partnerId: string;
  categoryId: string[];
  days: number;
  variationId: string;
  field_description: string;
  promoFlag: PromoFlag[];
  sku: string;
  idx: number;
  body: any;
  hotspot: boolean;
  weight: number;
  desc: {desc1: string; desc2: string; apn: string};
  // additional
  ccodeStr?: string;
  search?: string;
  pricePerDay?: Currency;
  cntry?: Set<string>;
  imageUrl?: string;
};

const toPurchaseItem = (prod?: RkbProduct) => {
  return prod ? createFromProduct(prod) : undefined;
};

const toProduct = (data: DrupalProduct[]): ApiResult<RkbProduct> => {
  const testProductReg = /test/;

  if (_.isArray(data)) {
    return api.success(
      data
        .filter((elm) => !testProductReg.test(elm.sku))
        .map((item, idx) => ({
          key: item.uuid,
          uuid: item.uuid,
          name: item.title,
          listPrice: utils.stringToCurrency(item.list_price),
          price: utils.stringToCurrency(item.price),
          field_daily: item.field_daily,
          volume: item.field_data_volume,
          partnerId: item.partner_id,
          categoryId: item.field_product_categories,
          days: utils.stringToNumber(item.field_days) || 0,
          variationId: item.variations && item.variations[0],
          field_description: item.field_description,
          promoFlag: item.field_special_categories
            .split(',')
            .map((v) => specialCategories[v.trim()])
            .filter((v) => !_.isEmpty(v)),
          sku: item.sku,
          body: item.body,
          idx,
          hotspot: item.field_hotspot === 'On',
          weight: utils.stringToNumber(item.field_weight),
          desc: item.field_desc
            ? JSON.parse(item.field_desc.replace(/&quot;/g, '"'))
            : {},
        })),
    );
  }

  return api.failure(api.E_NOT_FOUND);
};

type DrupalLocalOp = {
  nid: string;
  body: string;
  title: string;
  field_mcc_mnc: string;
  field_country: string[];
  field_image: string;
  field_network: string;
  field_apn_setting: string;
  field_weight: string;
  field_ref_partner: string;
};

type DrupalProdCountry = {
  name: string;
  description__value: string;
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
  partner: string;
};

export type RkbProdCountry = {
  name: string;
  keyword: string;
};

const toLocalOp = (data: DrupalLocalOp[]): ApiResult<RkbLocalOp> => {
  if (_.isArray(data)) {
    return api.success(
      data.map((item) => ({
        key: item.nid,
        name: item.title,
        ccode: item.field_country.sort(),
        mccmnc: item.field_mcc_mnc,
        apn: item.field_apn_setting,
        imageUrl: item.field_image,
        network: item.field_network,
        weight: utils.stringToNumber(item.field_weight) || 0,
        detail: item.body,
        partner: item.field_ref_partner,
      })),
    );
  }

  return api.failure(api.E_NOT_FOUND);
};

const toProdCountry = (
  data: DrupalProdCountry[],
): ApiResult<RkbProdCountry> => {
  if (_.isArray(data)) {
    return api.success(
      data.map((item) => ({
        name: item.name.replace(/<[^>]*>?/g, ''),
        keyword: item.description__value.replace(/<[^>]*>?/g, ''),
      })),
    );
  }

  return api.failure(api.E_NOT_FOUND);
};

const toColumnList = (v: RkbPriceInfo[]) => {
  return v
    .reduce((acc, cur) => {
      // grouping by country
      const idx = acc.findIndex((a) => a.country === cur.country);
      if (idx < 0) return acc.concat(cur);
      acc[idx].weight = Math.max(acc[idx].weight, cur.weight);
      acc[idx].partnerList.push(cur.partner);
      acc[idx].minPrice.value = Math.min(
        acc[idx].minPrice.value,
        cur.minPrice.value,
      );
      return acc;
    }, [] as RkbPriceInfo[])
    .sort((a, b) => b.weight - a.weight)
    .reduce((acc, cur) => {
      // 2단 list로 변환
      if (acc.length === 0) return [[cur]];
      const last = acc[acc.length - 1];
      return last.length <= 1
        ? acc.slice(0, acc.length - 1).concat([last.concat(cur)])
        : acc.concat([[cur]]);
    }, [] as RkbPriceInfo[][]);
};

const getTitle = (localOp?: RkbLocalOp) => {
  return localOp ? localOp.name.split('-')[0] : '';
};

const getProduct = (categoryCode?: string) => {
  const id = categoryCode ?? '';

  return api.callHttpGet(
    api.httpUrl(`${api.path.prodList}${id ? `/${id}` : ''}?_format=hal_json`),
    toProduct,
  );
};

const getProductByLocalOp = (partnerId: string) => {
  return api.callHttpGet(
    api.httpUrl(`${api.path.prodByLocalOp}/${partnerId}?_format=hal_json`),
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

const getProductByUuid = (uuid: string) => {
  if (_.isEmpty(uuid))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uuid');

  return api.callHttpGet<RkbProduct>(
    api.httpUrl(`${api.path.prodUuid}/${uuid}?_format=hal_json`),
    toProduct,
  );
};

const getLocalOp = (op?: string) => {
  return api.callHttpGet<RkbLocalOp>(
    api.httpUrl(`${api.path.localOp + (op ? `/${op}` : '')}?_format=hal_json`),
    toLocalOp,
  );
};

const getProdCountry = () => {
  return api.callHttpGet<RkbProdCountry>(
    api.httpUrl(`${api.path.prodCountry}?_format=hal_json`),
    toProdCountry,
  );
};

export type RkbProdByCountry = {
  category: string;
  country: string;
  price: string;
  partner: string;
  search?: string;
};
const productByCountry = () => {
  return api.callHttpGet<RkbProdByCountry>(
    api.httpUrl(
      `${api.path.rokApi.rokebi.prodByCountry}?_format=json&platform=${
        Platform.OS
      }&deviceid=${DeviceInfo.getModel()}`,
    ),
  );
};

export default {
  category,
  toPurchaseItem,
  toColumnList,
  getTitle,
  getProduct,
  getProductByLocalOp,
  getProductBySku,
  getLocalOp,
  getProdCountry,
  productByCountry,
  getProductByUuid,
};
