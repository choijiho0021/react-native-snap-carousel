import paymentApi from '../utils/api/paymentApi'
import 'isomorphic-fetch'

let uuid = ''
const auth = {
  user : '12345123451234512345',
  pass : '1111'
}

describe('Payment API', () => {
  it.skip(`Recharge`, () => {
    return paymentApi.recharge({amount: 500}, auth).then(resp =>  {
      console.log('resp', resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)
      uuid = resp.objects[0].uuid
    }).catch( err => {
      console.log('failed to add payment', err)
      expect(err).toBeNull()
    })
  });

  it.skip(`Purchase Product`, () => {
    const prod = {
      prodList:[
        {
          uuid: '7761e0f0-d441-4072-916f-6ac8bac54b56',
          startDate : '2019-09-24T00:00:00',
        }, 
        {
          uuid: "cbad42cb-1f40-419e-a49f-6cee017aa54c",
          startDate : '2019-09-24T00:00:00',
        }],
      amount: 1000,
      directPayment: 2000,
    }
    return paymentApi.buyProduct( prod, auth).then(resp =>  {
      console.log('resp', resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)
      uuid = resp.objects[0].uuid
    }).catch( err => {
      console.log('failed to add payment', err)
      expect(err).toBeNull()
    })
  });

  it.skip(`Purchase SIM Card`, () => {
    const prod = {
      simList:[
        {
          uuid: '6f56eefb-659b-4167-9934-6eab45712751',
          count: 1,
        }, 
        {
          uuid: '4c225f31-5f33-4926-b389-1c8a28a5d110',
          count: 1,
        }],
      amount: 1000,
      directPayment: 2000,
      deliveryAddressId: 'e2cbf363-6fcf-4f71-8c91-ea85d38968a9'
    }
    return paymentApi.buyProduct( prod, auth).then(resp =>  {
      console.log('resp', resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)
      uuid = resp.objects[0].uuid
    }).catch( err => {
      console.log('failed to add payment', err)
      expect(err).toBeNull()
    })
  });

  it.skip(`get REST api`, () => {
    return paymentApi.get( uuid, auth).then(resp =>  {
      console.log('resp', resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)
    }).catch( err => {
      console.log('failed to get recharge', err)
      expect(err).toBeNull()
    })
  });


  it(`get recharge history`, () => {
    const userId = 'a986abd0-55e8-4d08-9298-cc9e8ef25cbc'
    return paymentApi.getHistory( userId, auth).then(resp =>  {
      console.log('resp', resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)
    }).catch( err => {
      console.log('failed to get recharge', err)
      expect(err).toBeNull()
    })
  });

});
