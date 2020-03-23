import accountApi from '../utils/api/accountApi'
import 'isomorphic-fetch'
import API from '../utils/api/api'
import moment from 'moment'

const iccid = '12345123451234512345'
const actCode = '1111'
const auth = {
  user: iccid,
  pass: actCode
}
let uuid = ''

describe('Account API', () => {
  describe('Get Account', () => {

    it(`get Account with valid ICCID`, () => {

      return accountApi.getAccount(iccid).then(resp =>  {
        expect(resp.result).toEqual(0)
        expect(resp.objects.length).toBeGreaterThan(0)
        const account = resp.objects[0]
        console.log('Account', resp.objects[0])
        const accountNid = resp.objects[0].nid
        expect(account.iccid).toEqual(iccid)
        expect(account.nid).toBeGreaterThan(0)

        uuid = account.uuid
      })
    });

    it(`get Account with invalid ICCID`, () => {
      const iccid = '123'
      return accountApi.getAccount(iccid).then(resp =>  {
        expect(resp.result).toEqual(API.NOT_FOUND)
      })
    });
  })

  describe('Update Account', () => {
    it('get account by uuid', () => {
      return accountApi.getByUUID(uuid).then(resp => {
        console.log('resp', resp)
        expect(resp.result).toEqual(0)
      }).catch(err => {
        console.log('err', err)
        expect(err).toBeNull()
      })
    })

    it('update account', () => {
      const now = moment()
      const attr = {
        field_activation_code: '1111',
        field_activation_date: now.format(),
        field_expiration_date: now.add(1, 'years').format('YYYY-MM-DD')
      }
      return accountApi.update(uuid, auth, attr).then(resp => {
        console.log('resp', resp, attr)
        expect(resp.result).toEqual(0)
      }).catch(err => {
        console.log('err', err)
        expect(err).toBeNull()
      })
    })
  })


  describe('SIM Partner', () => {
    it('get SIM Partner by tid', () => {
      const tid = 1
      return accountApi.getSimPartnerByID(tid).then(resp => {
        console.log('resp', resp)
        expect(resp.result).toEqual(0)
      }).catch(err => {
        console.log('err', err)
        expect(err).toBeNull()
      })
    })

  })


});
