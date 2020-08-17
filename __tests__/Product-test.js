import {API} from '../submodules/rokebi-utils';
import 'isomorphic-fetch';

describe('Product API', () => {
  it(`전체 상품 목록을 가져온다.`, () => {
    return API.Product.getProduct()
      .then(resp => {
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
        [
          'key',
          'uuid',
          'name',
          'price',
          'field_daily',
          'partnerId',
          'categoryId',
          'days',
          'variationId',
          'field_description',
          'promoFlag',
          'sku',
          'idx',
        ].forEach(key => expect(resp.objects[0]).toHaveProperty(key));
      })
      .catch(err => {
        expect(err).toBeNull();
      });
  });
});
