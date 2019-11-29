import productApi from '../utils/api/productApi'
import 'isomorphic-fetch'

describe('Product API', () => {
  it(`get product by country`, () => {
    return productApi.getProductByCntry().then(resp =>  {
      console.log('resp', resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)
    }).catch( err => {
      console.log('failed to get products', err)
      expect(err).toBeNull()
    })
  });
});
