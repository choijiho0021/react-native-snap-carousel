/* eslint-disable no-param-reassign */
import _ from 'underscore';
import {Set} from 'immutable';
import {Platform} from 'react-native';
import utils from '@/redux/api/utils';
import {
  createFromAddOnProduct,
  createFromProduct,
} from '@/redux/models/purchaseItem';
import api, {ApiResult} from './api';
import {RkbPriceInfo} from '../modules/product';
import {colors} from '@/constants/Colors';
import Env from '@/environment';
import {parseJson} from '@/utils/utils';
import {EXCEED_CHARGE_QUADCELL_RSP} from '@/screens/ChargeTypeScreen';

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

type PromoFlag = 'sizeup' | 'doubleSizeup' | 'tripleSizeup' | 'hot' | 'fiveG';

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
  tripleSizeup: {
    backgroundColor: colors.lightYellow,
    fontColor: colors.yellowSecond,
  },
  fiveG: {
    // backgroundColor: colors.purplyBlue,
    fontColor: colors.purplyBlue,
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

export const promoFlagSort = (arr: string[]) => {
  const promoFlags: PromoFlag[] = [];

  arr.forEach((elm) => {
    if (
      ['sizeup', 'doubleSizeup', 'tripleSizeup', 'hot', 'fiveG'].includes(elm)
    )
      promoFlags.push(elm as PromoFlag);
  });

  // 정렬 규칙을 정의하는 비교 함수
  const customComparator = (a: PromoFlag, b: PromoFlag): number => {
    const order = {
      sizeup: 1,
      doubleSizeup: 2,
      tripleSizeup: 3,
      hot: 4,
      fiveG: 5,
    };

    const orderA = order[a] ?? 0;

    return orderA - order[b];
  };

  return promoFlags.sort(customComparator);
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
  field_network: string;
  field_fup_speed?: string;
};

export type CurrencyCode = 'KRW' | 'USD';
export type Currency = {
  value: number;
  currency: CurrencyCode;
};
export type ProdDesc = {
  desc1?: string;
  desc2?: string;
  apn?: string;
  ftr?: string;
  clMtd?: string;
  caution?: string;
  email_notice?: string;
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
  promoFlag: string[];
  sku: string;
  idx: number;
  body: any;
  hotspot: boolean;
  weight: number;
  desc: ProdDesc;
  // additional
  ccodeStr?: string;
  search?: string;
  pricePerDay?: Currency;
  cntry?: Set<string>;
  imageUrl?: string;
  network?: string;
  fup?: string;
};

const toPurchaseItem = (prod?: RkbProduct) => {
  return prod ? createFromProduct(prod) : undefined;
};

const toPurchaseAddOnItem = (subsId: string, prod?: RkbAddOnProd) => {
  return prod ? createFromAddOnProduct(prod, subsId) : undefined;
};

const toProdDesc = (data: DrupalProduct[]): ApiResult<ProdDesc> => {
  if (_.isArray(data) && data.length > 0) {
    return api.success(parseJson(data[0].field_desc.replace(/&quot;/g, '"')));
  }

  return api.failure(api.E_NOT_FOUND);
};

const toProduct = (data: DrupalProduct[]): ApiResult<RkbProduct> => {
  const testProductReg = /test/;

  if (_.isArray(data) && data.length > 0) {
    return api.success(
      data
        // .filter((elm) => !testProductReg.test(elm.sku))
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
            ? parseJson(item.field_desc.replace(/&quot;/g, '"'))
            : {},
          network: item.field_network,
          fup: item.field_fup_speed,
        })),
    );
  }

  return api.failure(api.E_NOT_FOUND);
};

type RkbAllProdJson = {
  tt: string;
  uid: string;
  sku: string;
  pr: string;
  lpr: string;
  da: string;
  vol: string;
  dys: string;
  fup: string;
  pid: string;
  ct: string;
  ctl: string;
  var: string;
  dsc: string;
  desc: string;
  sp: string[];
  hot: string;
  w: string;
  adn?: string;
  tpe: string;
  net: string;
};

const toAllProduct = (data: RkbAllProdJson[]): ApiResult<RkbProduct> => {
  if (data && data.length > 0) {
    return api.success(
      data.map((item, idx) => ({
        key: item.uid,
        uuid: item.uid,
        name: item.tt,
        listPrice: utils.stringToCurrency(item.lpr),
        price: utils.stringToCurrency(item.pr),
        field_daily: item.da,
        volume: item.vol,
        partnerId: item.pid,
        categoryId: item.ct,
        days: utils.stringToNumber(item.dys) || 0,
        variationId: item.var,
        field_description: item.dsc,
        promoFlag: item.sp
          .map((v) => specialCategories[v.trim()])
          .filter((v) => !_.isEmpty(v)),
        sku: item.sku,
        idx,
        hotspot: item.hot === '1',
        weight: utils.stringToNumber(item.w),
        network: item.net,
        fup: item.fup,
        body: '',
        desc: '',
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
  field_notice?: string;
};

type DrupalProdCountry = {
  key?: string;
  description__value?: string;
};

type DrupalAddonProd = {
  sku: string;
  title: string;
  price: string;
  list_price: string;
  id: string;
  days: string;
  volume: string;
  localop: string;
};

export type RkbAddOnProd = {
  sku: string;
  title: string;
  price: string;
  list_price: string;
  id: string;
  days: string;
  volume: string;
  localop: string;
};

export type RkbLocalOp = {
  key: string;
  name: string;
  ccode: string[];
  apn?: string;
  imageUrl: string;
  network: string;
  weight: number;
  detail?: string;
  partner: string;
  notice?: string;
};

export type RkbProdCountry = {
  keyword: string;
};

type RkbLocalOpJson = {
  tt: string; // title
  co: string[]; // country code
  img: string; // image URL
  mc: string[]; // mcc mnc
  nt: string; // network
  w: string; // weight
  id: string; // nid
  mg: string;
  pt: string; // partner
  n?: string; // notice option
  b?: string; // block list
};

const toLocalOp = (data: RkbLocalOpJson[]): ApiResult<RkbLocalOp> => {
  if (_.isArray(data)) {
    return api.success(
      data.map((item) => ({
        key: item.id,
        name: item.tt,
        ccode: item.co.sort(),
        mccmnc: item.mc,
        imageUrl: item.img,
        network: item.nt,
        weight: utils.stringToNumber(item.w) || 0,
        partner: item.pt.toLowerCase(),
        notice: item.n,
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
        keyword: item.key || item.description__value || '',
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

const toAddOnProd = (data: DrupalAddonProd[]): ApiResult<RkbAddOnProd> => {
  if (data.result === 0) {
    return api.success(data?.objects, data?.info);
  }
  if (
    data.result === api.E_INVALID_STATUS ||
    data.result === EXCEED_CHARGE_QUADCELL_RSP
  ) {
    return api.success(data?.objects, data?.info, data?.result);
  }
  return api.failure(api.E_NOT_FOUND);
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

const getAllProduct = () => {
  return api.callHttpGet(
    api.httpUrl(`${api.path.rokApi.rokebi.config}/allprod?_format=json`),
    toAllProduct,
  );
};

const getProductDescDetail = (prodUuid: string) => {
  return api.callHttpGet(
    api.httpUrl(`${api.path.prodDescDetail}/${prodUuid}?_format=hal_json`),
  );
};

const getProductDesc = (prodUuid: string) => {
  return api.callHttpGet(
    api.httpUrl(`${api.path.prodDesc}/${prodUuid}?_format=hal_json`),
    toProdDesc,
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

const getLocalOp = () => {
  return api.callHttpGet<RkbLocalOp>(
    api.httpUrl(`${api.path.rokApi.rokebi.config}/localop?_format=json`),
    toLocalOp,
  );
};

const getProdCountry = () => {
  return api.callHttpGet<RkbProdCountry>(
    api.httpUrl(`${api.path.prodCountry}?_format=hal_json`),
    toProdCountry,
  );
};

const getAddOnProduct = (subsId: string) => {
  return api.callHttpGet<RkbAddOnProd>(
    api.httpUrl(`${api.path.rokApi.rokebi.prodAddOn}/${subsId}?_format=json`),
    toAddOnProd,
  );
};

export type RkbProdByCountry = {
  category: string;
  country: string;
  price: string;
  partner: string;
  max_discount: string;
  search?: string;
  tags?: string;
};

type RkbProdByCntryJson = {
  ct: string;
  pt: string;
  co: string;
  pr: string;
  dis: string;
  tgs: string;
};

const toProdByCntry = (
  data: RkbProdByCntryJson[],
): ApiResult<RkbProdByCountry> => {
  if (_.isArray(data)) {
    return api.success(
      data.map((item) => ({
        category: item.ct,
        country: item.co,
        partner: item.pt,
        price: item.pr,
        max_discount: item.dis,
        tags: item.tgs,
      })),
    );
  }

  return api.failure(api.E_NOT_FOUND);
};

const productByCountry = () => {
  return api.callHttpGet<RkbProdByCountry>(
    api.httpUrl(
      `${api.path.rokApi.rokebi.config}/bycntry_${Platform.OS}?_format=json`,
    ),
    toProdByCntry,
  );
};

export default {
  category,
  toPurchaseItem,
  toPurchaseAddOnItem,
  toColumnList,
  getTitle,
  getProduct,
  getProductByLocalOp,
  getAllProduct,
  getProductDescDetail,
  getProductDesc,
  getProductBySku,
  getLocalOp,
  getProdCountry,
  productByCountry,
  getProductByUuid,
  getAddOnProduct,
};
