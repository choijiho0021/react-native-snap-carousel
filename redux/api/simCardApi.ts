import _ from 'underscore';
import api, {ApiResult, DrupalNode, DrupalNodeJsonApi} from './api';
import utils from '../utils';

export type RkbSimCard = {
  key: string;
  uuid: string;
  variationId?: string;
  sku?: string;
  //                    nid: item.nid[0].value,
  name: string;
  //                    created: item.created[0].value,
  //                    desc: item.body[0].processed.replace(this.re, ''),
  //                    model: item.model[0].value,
  balance?: number;
  price?: number;
  imageUrl?: string;
};

const toSimCard = (data: DrupalNode[]): ApiResult<RkbSimCard> => {
  if (_.isArray(data)) {
    return api.success(
      data.map((item) => ({
        key: item.uuid,
        uuid: item.uuid,
        variationId: item.variations && item.variations[0],
        sku: item.sku,
        //                    nid: item.nid[0].value,
        name: item.title,
        //                    created: item.created[0].value,
        //                    desc: item.body[0].processed.replace(this.re, ''),
        //                    model: item.model[0].value,
        balance: utils.stringToNumber(item.field_balance),
        price: utils.stringToNumber(item.list_price__number),
        imageUrl: item.field_images,
      })),
    );
  }

  return api.failure(api.E_NOT_FOUND);
};

export type RkbSimPartner = {
  uuid: string;
  tid: number;
  name: string;
  mccmnc: string;
};

const toSimPartner = (data: DrupalNodeJsonApi): ApiResult<RkbSimPartner> => {
  if (data.jsonapi) {
    const obj = _.isArray(data.data) ? data.data[0] : data.data;
    const attr = obj.attributes;
    return api.success([
      {
        uuid: obj.id,
        tid: Number(attr.drupal_internal__tid),
        name: attr.name,
        mccmnc: attr.field_mcc_mnc,
      },
    ]);
  }

  return api.failure(api.E_NOT_FOUND);
};

const get = () => {
  return api.callHttpGet(
    `${api.httpUrl(api.path.simCard)}?_format=hal_json`,
    toSimCard,
  );
};

const getSimPartnerByID = (tid: number) => {
  if (!_.isNumber(tid))
    return api.reject(api.E_INVALID_ARGUMENT, 'invalid parameter: tid');

  return api.callHttpGet(
    `${api.httpUrl(api.path.jsonapi.simPartner)}?filter[tid]=${tid}`,
    toSimPartner,
  );
};

export default {
  get,
  getSimPartnerByID,
};
