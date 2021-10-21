import _ from 'underscore';
import api, {ApiResult, DrupalNode, Langcode} from './api';

export type RkbPromotion = {
  uuid: string;
  title: string;
  imageUrl?: string;
  product_uuid?: string;
  notice?: {
    title?: string;
    body?: string;
    rule?: Record<string, string>;
    image?: {
      success?: string;
      failure?: string;
      noti?: string;
    };
  };
  langcode?: Langcode;
};

// Promotion 참여 상품에 대한 정보
export type RkbPromoInfo = {
  sku: string;
  userId: string;
  hold: number;
  available: number;
};

const toPromotion = (data: DrupalNode[]): ApiResult<RkbPromotion> => {
  if (_.isArray(data)) {
    return api.success(
      data.map((item) => {
        let rule;
        try {
          rule = JSON.parse(item.field_promotion_rule?.replace(/&quot;/g, '"'));
        } catch (err) {
          console.log(
            'Failed to parse promotion rule',
            item.field_promotion_rule,
          );
        }

        return {
          uuid: item.uuid,
          title: item.title,
          imageUrl: item.field_image,
          product_uuid: item.field_product_uuid, // product variation id
          notice: item.field_ref_content
            ? {
                title: item.field_notice_title,
                body: item.field_notice_body,
                rule,
                image: {
                  success: item.field_successful_image,
                  failure: item.field_failure_image,
                  noti: item.field_noti_image,
                },
              }
            : undefined,
        };
      }),
    );
  }
  return api.failure(api.E_NOT_FOUND);
};

const toPromoInfo = (data: {
  result: number;
  objects: RkbPromoInfo[];
}): ApiResult<RkbPromoInfo> => {
  return api.success(data.objects, [], data.result);
};

const getPromotion = () => {
  return api.callHttpGet<RkbPromotion>(
    `${api.httpUrl(api.path.promotion)}?_format=hal_json`,
    toPromotion,
  );
};

// Promotion 참여를 위한 API
const check = (sku: string) => {
  if (sku) {
    return api.callHttpGet<RkbPromoInfo>(
      `${api.httpUrl(api.path.promo)}/${sku}?_format=json`,
      toPromoInfo,
    );
  }
  return api.reject(api.E_INVALID_ARGUMENT, 'sku not found');
};

const join = ({
  rule,
  iccid,
  token,
}: {
  rule: Record<string, string>;
  iccid?: string;
  token?: string;
}) => {
  if (!rule || !iccid || !token) {
    return api.reject(
      api.E_INVALID_ARGUMENT,
      `missing parameter: rule:${rule} iccid:${iccid} ${token}`,
    );
  }

  return api.callHttp<RkbPromoInfo>(
    `${api.httpUrl(api.path.promo)}?_format=json`,
    {
      method: 'POST',
      headers: api.withToken(token, 'json', {Accept: 'application/json'}),
      body: JSON.stringify({sku: rule.sku, iccid}),
    },
    toPromoInfo,
  );
};

export default {getPromotion, join, check};
