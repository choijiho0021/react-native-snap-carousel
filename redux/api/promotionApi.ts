import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import Share from 'react-native-share';
import _ from 'underscore';
import moment from 'moment';
import api, {ApiResult, DrupalNode, Langcode} from './api';
import Env from '@/environment';
import i18n from '@/utils/i18n';
import {parseJson, retrieveData, utils} from '@/utils/utils';
import {RkbProdByCountry} from './productApi';
import {Country} from '.';
import {Platform} from 'react-native';

const POPUP_DIS_DAYS = 7;
const {bundleId, appStoreId, dynamicLink, webViewHost, iosBundleId} = Env.get();

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
  promo: {
    from: string;
    to: string;
    uri: string;
  };
};

export type RkbGiftImages = {
  title: string;
  image: string;
  uuid: string;
};

export type RkbEventRule = {
  link?: boolean;
  image?: boolean;
  imageQuality?: number;
};

export type RkbEvent = {
  title: string;
  rule?: RkbEventRule;
  notice?: string;
  uuid?: string;
  nid?: string;
  activationDate?: string;
  expirationDate?: string;
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
    const today = moment();
    return api.success(
      data
        .map((item) => {
          const rule = parseJson(item.field_promotion_rule) || {};

          return {
            title: item.title,
            rule,
            notice: item.field_notice || '',
            uuid: item.uuid || '',
            nid: item.nid || '',
            activationDate: item.field_activation_date || '',
            expirationDate: item.field_expiration_date || '',
          };
        })
        .filter((event) =>
          today.isBetween(
            moment(event.activationDate),
            moment(event.expirationDate),
          ),
        ),
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
      data.objects.map(
        (v) =>
          ({
            inviteCount: v.invite_count,
            rokebiCash: v.rokebi_cash,
            signupGift: v.signup_gift,
            recommenderGift: v.recommender_gift,
            promo: v.promo,
          } as RkbInviteStatInfo),
      ),
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
    `${api.httpUrl(api.path.gift.content)}?_format=json`,
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
  return `${webViewHost}/link?recommender=${recommender}${
    gift?.length > 0 ? `&gift=${gift}` : ''
  }`;
};

export const shareWebViewLink = (
  uuid: string,
  country: RkbProdByCountry,
  isOfl = false,
  needDomain = true,
) => {
  // ofl localhost 직접 입력 시 firebase 콘솔에 설정된 보안 규칙에 어긋나서 동작 안함

  const param = `partnerId=${country.partner}&uuid=${uuid}`;

  // ofl 값만 encode를 안합니다. 그래서 파라미터 uuid가 잘리는 현상이 발견됨 (Android 일때만).
  // IOS는 WebLink에 한글 들어가면 동작 안함 -> 웹에서 search말고도 동작 되게 수정해야함
  return `${needDomain ? `${webViewHost}/` : ''}esim/${country.country}/${
    Platform.OS === 'android' ? country.search?.split(',')[1] : 'page'
  }?${Platform.OS === 'android' ? encodeURIComponent(param) : param}`;
};

const shareLink = (uuid: string) => {
  return `${webViewHost}/product/link?uuid=${uuid}`;
};

// 다이나믹 링크를 활용한 초대링크 생성
const buildShareLink = async ({
  imageUrl,
  prodName,
  uuid,
  country,
  isShort = true,
}: {
  imageUrl: string;
  prodName: string;
  uuid: string;
  counry: RkbProdByCountry;
  isShort?: boolean;
}) => {
  const webLink = shareWebViewLink(uuid, country);

  const input = {
    link: shareLink(uuid),
    domainUriPrefix: dynamicLink,
    otherPlatform: {
      fallbackUrl: shareWebViewLink(uuid, country, true),
    },
    ios: {
      bundleId: Platform.OS === 'ios' ? bundleId : iosBundleId,
      fallbackUrl: webLink,
    },
    android: {
      packageName: 'com.rokebiesim',
      fallbackUrl: webLink,
    },
    social: {
      title: i18n.t('share:title'),
      descriptionText: i18n.t('share:desc').replace('*', prodName),
      imageUrl,
    },
    navigation: {
      forcedRedirectEnabled: true,
    },
  };

  const url = isShort
    ? await dynamicLinks().buildShortLink(input)
    : await dynamicLinks().buildLink(input);

  return url;
};

// 다이나믹 링크를 활용한 초대링크 생성
const buildLink = async ({
  recommender,
  cash,
  imageUrl,
  subsId = '',
  isShort = true,
}: {
  recommender: string;
  cash: string;
  imageUrl: string;
  subsId?: string;
  isShort?: boolean;
}) => {
  const input = {
    link: inviteLink(recommender, subsId || ''),
    domainUriPrefix: dynamicLink,
    ios: {
      bundleId: Platform.OS === 'ios' ? bundleId : iosBundleId, // bundleId가 안 맞으면 link만 동작, ifl 미동작
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
  };

  const url = isShort
    ? await dynamicLinks().buildShortLink(input)
    : await dynamicLinks().buildLink(input);

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
  group: string;
  dimension: string;
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
  buildShareLink,
  getExtraCoupon,
};
