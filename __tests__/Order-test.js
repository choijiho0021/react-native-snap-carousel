import orderApi from '../utils/api/orderApi'
import 'isomorphic-fetch'
import userApi from '../utils/api/userApi';

const auth = {
  user : '12345123451234512345',
  pass : '1111'
}
let userId = ''

describe('Order API', () => {
  it.skip(`get delivery address`, () => {
    return userApi.getByName( auth.user, auth).then(resp => {
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)

      userId = resp.objects[0].id

      console.log("user", userId, auth)

      return orderApi.getCustomerProfile(userId, auth).then(resp =>  {
        console.log('resp', resp)
        expect(resp.result).toEqual(0)
        expect(resp.objects.length).toBeGreaterThan(0)
      }).catch( err => {
        console.log('failed to get address', err)
        expect(err).toBeNull()
      })
    })
  });

  it('add delivery address', () => {
    const addr = {
      title: '집주소-1',
      details: '102-100',
      jibunAddr: '수내동 9-4 현대 오피스 10층 (주) 유엔젤',
      mobile: '01010002000',
      recipient: '유엔젤',
      roadAddr: '수내동 현대 오피스 10층 (주) 유엔젤 ',
      phone: '0317106222',
      zipNo: '12345'
    }

    return orderApi.addDeliveryAddress(addr, auth).then(resp =>  {
      console.log('resp', resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)

      return orderApi.delDeliveryAddress(resp.objects[0].uuid, auth).then( rsp => {
        console.log('delete', rsp)
        expect(rsp.result).toEqual(0)
      }).catch(err => {
        console.log('failed to delete address', err)
        expect(err).toBeNull()
      })

    }).catch( err => {
      console.log('failed to add address', err)
      expect(err).toBeNull()
    })
  })

  it.skip('delete delivery address', () => {
    const uuid = 'a61e3f5d-354d-41c9-bf4e-9b9496c0c918'

    return orderApi.delDeliveryAddress(uuid, auth).then( resp => {
      console.log('delete', resp)
      expect(resp.result).toEqual(0)
    }).catch(err => {
      console.log('failed to delete address', err)
      expect(err).toBeNull()
    })

  })
});
