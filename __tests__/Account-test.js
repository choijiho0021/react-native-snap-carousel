// import accountApi from '../utils/api/accountApi'
// import 'isomorphic-fetch'
// import api from '../utils/api/api'
// import moment from 'moment'

// const iccid = '12345123451234512345'
// const actCode = '1111'
// const auth = {
//   user: iccid,
//   pass: actCode
// }
// let uuid = ''

// describe('Account API', () => {
//   describe('Get Account', () => {

//     it(`get Account with valid ICCID`, () => {

//       return accountApi.getAccount(iccid).then(resp =>  {
//         expect(resp.result).toEqual(0)
//         expect(resp.objects.length).toBeGreaterThan(0)
//         const account = resp.objects[0]
//         console.log('Account', resp.objects[0])
//         const accountNid = resp.objects[0].nid
//         expect(account.iccid).toEqual(iccid)
//         expect(account.nid).toBeGreaterThan(0)

//         uuid = account.uuid
//       })
//     });

//     it(`get Account with invalid ICCID`, () => {
//       const iccid = '123'
//       return accountApi.getAccount(iccid).then(resp =>  {
//         expect(resp.result).toEqual(api.E_NOT_FOUND)
//       })
//     });
//   })
// });
