import _ from 'underscore';
import api, {ApiResult} from './api';

type DrupalDevList = {
  name: string;
};

const toDevList = (data: DrupalDevList[]): ApiResult<string> => {
  if (_.isArray(data)) {
    return api.success(data.map((item) => item.name));
  }

  return api.failure(api.E_NOT_FOUND);
};

const getDevList = () => {
  return api.callHttpGet<string>(
    `${api.httpUrl(api.path.esimDev)}?_format=hal_json`,
    toDevList,
  );
};

export default {getDevList};
