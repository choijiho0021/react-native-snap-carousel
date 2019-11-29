import addressApi from '../utils/api/addressApi'
import 'isomorphic-fetch'

describe('Address API', () => {
  describe('Get Address', () => {

    it(`find address with key '수내동'`, () => {
      const key = '수내동'
      return addressApi.find(key).then(resp =>  {
        expect(resp.result).toEqual(0)
        expect(resp.objects.length).toBeGreaterThan(0)
      }).catch(err => {
        console.log('failed', err)
        expect(err).toBeNull()
      })
    });
  })
});
