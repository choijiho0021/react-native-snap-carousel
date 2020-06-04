import notiApi from '../utils/api/notiApi'
import 'isomorphic-fetch'
import api from '../utils/api/api'

const iccid = '12345123451234512345'
const actCode = '1111'
const auth = {
  user: iccid,
  pass: actCode
}
let uuid = ''

describe('Noti API', () => {
  describe('Get Noti', () => {

    it(`get Noti with valid ICCID`, () => {
      return notiApi.getNoti(iccid).then(resp =>  {
        console.log("resp",resp)
        expect(resp.objects.length).toBeGreaterThan(0)
        const noti = resp.objects[0]
        expect(noti.name).toEqual(iccid)

        uuid = resp.objects[0].uuid
      })
    });

    it(`get Noti with invalid ICCID`, () => {
      const iccid = '123'
      return notiApi.getNoti(iccid).then(resp =>  {
        expect(resp.result).toEqual(api.E_NOT_FOUND)
      })
    });
  });

  describe('Update Noti isread', () => {
    it('Update Noti isread', () => {
      const attr = {
        field_isread: true
      }
      return notiApi.update(uuid,auth,attr).then(resp => {
        console.log("resp1",resp)

      })

    });
  });

});

