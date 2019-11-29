import rechargeApi from '../utils/api/rechargeApi'

let uuid = ''
const auth = {
  user : '12345123451234512345',
  pass : '1111'
}

describe('Recharge API', () => {
  it(`POST REST api`, () => {
    return rechargeApi.add({amount: 500}, auth).then(resp =>  {
      console.log('resp', resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)
      uuid = resp.objects[0].uuid
    }).catch( err => {
      console.log('failed to get recharge', err)
      expect(err).toBeNull()
    })
  });

  it(`get REST api`, () => {
    return rechargeApi.get( uuid, auth).then(resp =>  {
      console.log('resp', resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)
    }).catch( err => {
      console.log('failed to get recharge', err)
      expect(err).toBeNull()
    })
  });


  it.skip(`get recharge history`, () => {
    const userId = '31a9abd1-6d84-4067-81ec-9545d444e1db'
    return rechargeApi.getHistory( userId, auth).then(resp =>  {
      console.log('resp', resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)
    }).catch( err => {
      console.log('failed to get recharge', err)
      expect(err).toBeNull()
    })
  });

});
