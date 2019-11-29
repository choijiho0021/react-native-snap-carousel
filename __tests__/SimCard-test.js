import simCardApi from '../utils/api/simCardApi'
import 'isomorphic-fetch'

const iccid = '12345123451234512345'
const actCode = '1111'
const auth = {
  user: iccid,
  pass: actCode
}

describe('SimCard API', () => {

  it(`get card list`, () => {
    return simCardApi.get(auth).then(resp =>  {
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)
      const card = resp.objects[0]
      console.log('card', card)
      expect(card.image).toBeTruthy()
    }).catch(err => {
      console.log('failed', err)
      expect(err).toBeNull()
    })
  });

});
