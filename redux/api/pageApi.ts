import _ from 'underscore';
import api, {ApiResult, DrupalNode, DrupalNodeJsonApi} from './api';

export type RkbInfo = {
  key: string;
  uuid: string;
  title: string;
  body?: string;
  created: string;
};

const toPage = (data: DrupalNode[] | DrupalNodeJsonApi): ApiResult<RkbInfo> => {
  if (_.isArray(data)) {
    return api.success(data);
  }

  if (!_.isEmpty(data.jsonapi)) {
    // jsonapi result
    const obj = _.isArray(data.data) ? data.data : [data.data];
    return api.success(
      obj.map((item) => ({
        key: item.id,
        uuid: item.id,
        title: item.attributes.title,
        body: item.attributes.body.processed,
        created: item.attributes.created,
      })),
    );
  }

  return api.failure(api.E_NOT_FOUND, data.message);
};

export type RkbProductDetail = DrupalNode;
const toProductDetails = (data: DrupalNode[]): ApiResult<RkbProductDetail> => {
  if (_.isArray(data)) {
    return api.success(data);
  }

  return api.failure(api.E_NOT_FOUND);
};

const getPageByCategory = (name: string) => {
  if (!name)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: name');

  return api.callHttpGet(
    `${api.httpUrl(
      api.path.jsonapi.page,
    )}?filter[field_category.name]=${name}&sort=-field_weight`,
    toPage,
  );
};

const getPageByTitle = (title?: string) => {
  if (!title)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: title');

  return api.callHttpGet(
    `${api.httpUrl(
      api.path.jsonapi.page,
    )}?filter[title]=${title}&sort=field_weight`,
    toPage,
  );
};

const getProductDetails = (abortController?: AbortController) => {
  return api.callHttpGet(
    `${api.httpUrl(api.path.productDetails)}?_format=json`,
    toProductDetails,
    undefined,
    {abortController},
  );
};

export default {
  getPageByCategory,
  getPageByTitle,
  getProductDetails,
};
