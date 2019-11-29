import promotionApi from '../utils/api/promotionApi'
import 'isomorphic-fetch'

describe('Promotion API', () => {
  it(`get product by country`, () => {
    return promotionApi.getPromotion().then(resp =>  {
      console.log('resp', resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)
    }).catch( err => {
      console.log('failed to get promotion', err)
      expect(err).toBeNull()
    })
  });
});
