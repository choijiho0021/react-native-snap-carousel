import _ from 'underscore';
import api from './api';

const toAppVersion = (data) => {
  if (!_.isEmpty(data.jsonapi)) {
    // jsonapi result
    const obj = _.isArray(data.data) ? data.data : [data.data];
    return api.success(
      obj.map((item) => ({
        uuid: item.id,
        title: item.attributes.title || '',
        body: item.attributes.body || '',
        created: item.attributes.created,
        updateOption: item.attributes.field_update_option,
      })),
    );
  }

  return api.failure(api.E_NOT_FOUND, data.message);
};

const getAppVersion = (ver: string) => {
  return api.callHttpGet(
    `${api.httpUrl(api.path.jsonapi.app)}?filter[title]=${ver}`,
    toAppVersion,
    {'content-type': 'vnd.api+json'},
  );
};

export default {getAppVersion};
