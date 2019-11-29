import subsApi from '../utils/api/subscriptionApi'
import userApi from '../utils/api/userApi';
import 'isomorphic-fetch'

const auth = {
  user : '12345123451234512345',
  pass : '1111'
}
let userId = ''

describe('Subscription API', () => {
  it(`get subscription`, () => {
    return userApi.getByName( auth.user, auth).then(resp => {
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)

      userId = resp.objects[0].id

      console.log("user", userId, auth)

      return subsApi.getSubscription(userId, auth).then(resp =>  {
        console.log('resp', resp)
        expect(resp.result).toEqual(0)
        expect(resp.objects.length).toBeGreaterThan(0)
      }).catch( err => {
        console.log('failed to get address', err)
        expect(err).toBeNull()
      })
    })
  });

  it.skip('add subscription', () => {
    const subs = {
      title: 'subs-1',
      uuid: '7761e0f0-d441-4072-916f-6ac8bac54b56',
      startDate : '2019-09-24T00:00:00+00:00'
    }

    return subsApi.addSubscription(subs, auth).then(resp =>  {
      console.log('resp', resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)

    }).catch( err => {
      console.log('failed to add address', err)
      expect(err).toBeNull()
    })
  })

  it(`get subscription history`, () => {
    const userId = 'a986abd0-55e8-4d08-9298-cc9e8ef25cbc'
    return subsApi.getHistory( userId, auth).then(resp =>  {
      console.log('resp', resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)
    }).catch( err => {
      console.log('failed to get subscription', err)
      expect(err).toBeNull()
    })
  });

});
