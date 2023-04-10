import dynamicLinks from '@react-native-firebase/dynamic-links';
import Share from 'react-native-share';
import _ from 'underscore';
import moment from 'moment';
import api, {ApiResult, DrupalNode, Langcode} from './api';
import Env from '@/environment';
import i18n from '@/utils/i18n';
import {parseJson, retrieveData, utils} from '@/utils/utils';

const POPUP_DIS_DAYS = 7;
const {bundleId, appStoreId, dynamicLink, webViewHost} = Env.get();

export type RkbPromotion = {
  uuid: string;
  title: string;
  imageUrl?: string;
  product_uuid?: string;
  rule?: Record<string, any>;
  notice?: {
    title?: string;
    body?: string;
    nid: number;
    image?: {
      success?: string;
      failure?: string;
      noti?: string;
      thumbnail?: string;
    };
  };
  langcode?: Langcode;
  popUpDisabled?: boolean;
  isPopup?: boolean;
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

export type RkbGiftImages = {
  title: string;
  image: string;
  uuid: string;
};

export type RkbEventRule = {
  link?: boolean;
  image?: boolean;
};

export type RkbEvent = {
  title: string;
  rule?: RkbEventRule;
  notice?: {
    title?: string;
    body?: string;
  };
  uuid?: string;
};

const toPromotion = (data: DrupalNode[]): ApiResult<RkbPromotion> => {
  if (_.isArray(data)) {
    return api.success(
      data.map((item) => {
        const rule =
          item.field_promotion_rule &&
          parseJson(item.field_promotion_rule?.replace(/&quot;/g, '"'));
        return {
          uuid: item.uuid,
          title: item.title,
          imageUrl: item.field_image,
          product_uuid: item.field_product_uuid, // product variation id
          isPopup: item.field_ispopup === 'On',
          rule,
          notice: item.field_ref_content
            ? {
                nid: parseInt(item.nid, 10),
                title: item.field_notice_title,
                body: item.field_notice_body,
                image: {
                  success: item.field_successful_image,
                  failure: item.field_failure_image,
                  noti: item.field_noti_image,
                  thumbnail: item.thumbnail_image,
                },
              }
            : undefined,
        };
      }),
    );
  }
  return api.failure(api.E_NOT_FOUND);
};

const toEvent = (data: DrupalNode[]): ApiResult<RkbEvent> => {
  if (_.isArray(data)) {
    return api.success(
      data.map((item) => {
        const rule = item.field_promotion_rule
          ? JSON.parse(item.field_promotion_rule)
          : {};

        return {
          title: item.title,
          rule,
          notice: {
            title: item.field_notice_title || '',
            body: item.field_notice_body || '',
          },
          uuid: item.uuid || '',
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

const toGift = (data: {
  result: {code: number};
  objects: [];
}): ApiResult<object> => {
  if (data.result.code === 0) {
    return api.success(data.objects, [], data.result);
  }

  return api.failure(api.FAILED, data?.desc);
};

const toGiftBgImages = (data: []): ApiResult<RkbGiftImages> => {
  // if (data.result === 0) {
  return api.success(
    data.map((v) => {
      return {
        title: v.title,
        image: v.field_gift_images,
        uuid: v.uuid,
      };
    }),
    // [],
    // data.result,
  );
  // }
  // return api.failure(api.FAILED, data.result?.error);
};

const getPromotion = async () => {
  const now = moment();

  const apiResp = await api.callHttpGet<RkbPromotion>(
    `${api.httpUrl(api.path.promotion)}?_format=hal_json`,
    toPromotion,
  );

  const objects = await Promise.all(
    apiResp.objects.map(async (elm) => {
      const lastPopUpDate = await retrieveData(`popupDisabled_${elm?.uuid}`);
      const popUpDisabled = lastPopUpDate
        ? moment.duration(now.diff(lastPopUpDate)).asDays() <= POPUP_DIS_DAYS
        : false;

      return {...elm, popUpDisabled};
    }),
  );

  return {...apiResp, objects};
};

const getStat = () => {
  return api.callHttpGet<RkbInviteStatInfo>(
    `${api.httpUrl(api.path.invite)}?_format=json`,
    toStatInfo,
  );
};

const getGiftBgImages = () => {
  return api.callHttpGet<RkbGiftImages>(
    `${api.httpUrl(api.path.gift.images)}?_format=hal_json`,
    toGiftBgImages,
  );
};

const getEvent = async () => {
  return api.callHttpGet<RkbEvent>(
    `${api.httpUrl(api.path.event)}?_format=hal_json`,
    toEvent,
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
// content type > Gift 생성
const createContent = ({
  msg, // text
  nid, // subscription nid
  image, // selected background image title
  token,
  link, // dynamic link with recommender, prodId
}: {
  msg: string;
  nid?: string;
  image: string;
  token?: string;
  link: string;
}) => {
  if (!msg || !nid || !image || !token) {
    return api.reject(
      api.E_INVALID_ARGUMENT,
      `missing parameter: msg:${msg} nid:${nid} token:${token} image:${image}`,
    );
  }

  return api.callHttp<object>(
    `${api.httpUrl(api.path.gift.content, '')}?_format=json`,
    {
      method: 'POST',
      headers: api.withToken(token, 'json', {Accept: 'application/json'}),
      body: JSON.stringify({
        msg,
        ref_subscription: nid,
        image,
        gift_link: link,
      }),
    },
    toGift,
  );
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

const inviteLink = (recommender: string, gift: string = '') => {
  return `${webViewHost}?recommender=${recommender}${
    gift?.length > 0 ? `&gift=${gift}` : ''
  }`;
};

// 다이나믹 링크를 활용한 초대링크 생성
const buildLink = async ({
  recommender,
  cash,
  imageUrl,
  subsId = '',
}: {
  recommender: string;
  cash: string;
  imageUrl: string;
  subsId?: string;
}) => {
  const url = await dynamicLinks().buildShortLink({
    link: inviteLink(recommender, subsId || ''),
    domainUriPrefix: dynamicLink,
    ios: {
      bundleId,
      appStoreId,
    },
    android: {
      packageName: 'com.rokebiesim',
    },
    social: {
      title: i18n
        .t('invite:title')
        .replace('*', utils.numberToCommaString(cash)),
      descriptionText: i18n.t('invite:desc'),
      imageUrl,
    },
    navigation: {
      forcedRedirectEnabled: true,
    },
  });

  return url;
};

const invite = async (
  recommender: string,
  gift: string,
  rule: Record<string, string>,
) => {
  const {share, prodId} = rule;

  // prodId 관련 추가 필요
  const url = await buildLink({
    recommender,
    cash: gift,
    imageUrl: share,
    subsId: prodId,
  });

  try {
    const result = await Share.open({
      url,
    });
    if (result.action !== Share.dismissedAction) {
      // adjust appEvent 앱 업데이트 추가
      // Adjust.trackEvent(new AdjustEvent(adjustInvite));
    }

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

export type RkbExtraCoupon = {
  title: string;
  image: string;
  download: string;
  uuid: string;
};
const toExtraCoupon = (data: RkbExtraCoupon[]): ApiResult<RkbExtraCoupon> => {
  if (_.isArray(data)) {
    return api.success(data);
  }
  return api.failure(api.E_NOT_FOUND);
};

const getExtraCoupon = () => {
  return api.callHttpGet<RkbExtraCoupon>(
    `${api.httpUrl(api.path.extraCoupon)}?_format=json`,
    toExtraCoupon,
  );
};

export default {
  getEvent,
  getPromotion,
  getStat,
  getGiftBgImages,
  createContent,
  join,
  check,
  invite,
  buildLink,
  getExtraCoupon,
};
