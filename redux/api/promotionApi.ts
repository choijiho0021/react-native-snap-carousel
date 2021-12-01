import dynamicLinks from '@react-native-firebase/dynamic-links';
import {Share} from 'react-native';
import _ from 'underscore';
import api, {ApiResult, DrupalNode, Langcode} from './api';
import Env from '@/environment';
import i18n from '@/utils/i18n';

const {bundleId, appStoreId, dynamicLink} = Env.get();

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

export type RkbInviteStatInfo = {
  inviteCount: string;
  rokebiCash: string;
  signupGift: string;
  recommenderGift: string;
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

const toStatInfo = (data: {
  result: number;
  objects: [];
}): ApiResult<RkbInviteStatInfo> => {
  if (data.result === 0) {
    return api.success(
      data.objects.map((v) => {
        return {
          inviteCount: v.invite_count,
          rokebiCash: v.rokebi_cash,
          signupGift: v.signup_gift,
          recommenderGift: v.recommender_gift,
        };
      }),
      [],
      data.result,
    );
  }
  return api.failure(api.FAILED, data.result?.error);
};

const getPromotion = () => {
  return api.callHttpGet<RkbPromotion>(
    `${api.httpUrl(api.path.promotion)}?_format=hal_json`,
    toPromotion,
  );
};

const getStat = () => {
  return api.callHttpGet<RkbInviteStatInfo>(
    `${api.httpUrl(api.path.invite)}?_format=json`,
    toStatInfo,
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

const inviteLink = (recommender: string, prodId: string = '') => {
  return `${api.httpUrl('')}?recommender=${recommender}${
    prodId?.length > 0 ? `&prodId=${prodId}` : ''
  }`;
};

// 다이나믹 링크를 활용한 초대링크 생성
const buildLink = async (
  recommender: string,
  imageUrl: string,
  prodId: string = '',
) => {
  const url = await dynamicLinks().buildShortLink({
    link: inviteLink(recommender, prodId),
    domainUriPrefix: dynamicLink,
    ios: {
      bundleId,
      appStoreId,
    },
    social: {
      // title, description 변경 예정
      title: i18n.t('invite:title'),
      descriptionText: i18n.t('invite:desc'),
      imageUrl,
    },
    navigation: {
      forcedRedirectEnabled: true,
    },
  });

  return url;
};

const invite = async (recommender: string, rule: Record<string, string>) => {
  const {share, prodId} = rule;

  // prodId 관련 추가 필요

  const url = await buildLink(recommender, share, prodId);

  try {
    await Share.share({
      url,
    });
    // if (result.action === Share.sharedAction) {
    //   if (result.activityType) {
    //     // shared with activity type of result.activityType
    //   } else {
    //     // shared
    //   }
    // } else if (result.action === Share.dismissedAction) {
    //   // dismissed
    // }
  } catch (error) {
    console.log(error.message);
  }
};

export default {
  getPromotion,
  getStat,
  join,
  check,
  invite,
  buildLink,
};
