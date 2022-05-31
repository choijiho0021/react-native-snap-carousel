/* eslint-disable no-param-reassign */
import _ from 'underscore';
import {Set, Map as ImmutableMap} from 'immutable';
import utils from '@/redux/api/utils';
import {Store} from '@/redux/modules/cart';
import {createFromProduct} from '@/redux/models/purchaseItem';
import api, {ApiResult} from './api';
import {Country} from '.';

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
          price: utils.stringToCurrency(item.price),
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

const getProduct = (categoryCode?: string) => {
  const id = categoryCode ?? '';
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
const getProdGroup = ({
  prodList,
  localOpList,
}: {
  prodList: ImmutableMap<string, RkbProduct>;
  localOpList: ImmutableMap<string, RkbLocalOp>;
}) => {
  const list: RkbProduct[][] = [];

  prodList
    .valueSeq()
    .toArray()
    .forEach((item) => {
      if (localOpList.has(item.partnerId)) {
        const localOp = localOpList.get(item.partnerId);
        item.ccodeStr = (localOp?.ccode || []).join(',');
        item.cntry = Set(Country.getName(localOp?.ccode));
        item.search = [...item.cntry]
          .concat([...Set(Country.getName(localOp?.ccode, 'en'))])
          .join(',');
        item.pricePerDay =
          item.price && item.days
            ? {
                value:
                  item.price.currency === 'KRW'
                    ? Math.round(item.price.value / item.days / 10) * 10
                    : Math.round((item.price.value / item.days) * 100) / 100,
                currency: item.price.currency,
              }
            : {value: 0, currency: item.price.currency};

        const idxCcode = list.findIndex(
          (elm) => elm.length > 0 && elm[0].ccodeStr === item.ccodeStr,
        );

        if (idxCcode < 0) {
          // new item, insert it
          list.push([item]);
        } else {
          // 이미 같은 country code를 갖는 데이터가 존재하면, 그 아래에 추가한다. (2차원 배열)
          list[idxCcode].push(item);
        }
      }
    });

  return list;
};

const sortProdGroup = (
  localOpList: ImmutableMap<string, RkbLocalOp>,
  list: RkbProduct[][],
) => {
  const getMaxWeight = (item: RkbProduct[]) =>
    Math.max(...item.map((p) => localOpList.get(p.partnerId)?.weight || 0));

  return list
    .map((item) =>
      item.sort((a, b) => {
        // 동일 국가내의 상품을 정렬한다.
        // field_daily == true 인 무제한 상품 우선, 사용 날짜는 오름차순
        // if (a.field_daily) return b.field_daily ? a.days - b.days : -1;
        // return b.field_daily ? 1 : a.days - b.days;

        // 일일 사용량 상품, 사용 날짜, 이름 정렬
        if (a.field_daily === b.field_daily) {
          if (a.days === b.days) {
            return a.name < b.name ? 1 : -1;
          }
          return a.days - b.days;
        }
        if (a.field_daily) {
          return -1;
        }
        return 1;
      }),
    )
    .sort((a, b) => {
      // 국가는 weight 값이 높은 순서가 우선, weight 값이 같으면 이름 순서
      const weightA = getMaxWeight(a);
      const weightB = getMaxWeight(b);
      if (weightA === weightB) {
        return a[0].search < b[0].search ? -1 : 1;
      }
      return weightB - weightA;
    });
};

const filterByCategory = (list: RkbProduct[][], key: string) => {
  const filtered = list.filter(
    (elm) => elm.length > 0 && elm[0].categoryId.includes(key),
  );

  return toColumnList(filtered);
};

export default {
  category,
  toPurchaseItem,
  toColumnList,
  getTitle,
  getProduct,
  getProductBySku,
  getLocalOp,
  getProdGroup,
  sortProdGroup,
  filterByCategory,
};
