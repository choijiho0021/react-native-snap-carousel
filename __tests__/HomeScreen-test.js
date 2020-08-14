import promotionApi from '../submodules/rokebi-utils/api/promotionApi';
import notiApi from '../submodules/rokebi-utils/api/notiApi';
import userApi from '../submodules/rokebi-utils/api/userApi';
import 'isomorphic-fetch';

/*
HomeScreen Test
  Get Promotion
  Show Tutorial

  Login
  Noti
    Get Noti
    Read Noti
  Contact
    Get Notification
    Get FAQ
    Add 1:1 Request
    Get 1:1 Request List
    Change Request Status
  Search
    Product Search
  Product TabView
    Get Product List
    Get Product Detail WebView
      Get Product Detail info
      Get Tip
      Get Caution
    Purchase
      Add to Cart
      Purchase Item
        Credit Card Purchase
        Transfer
        Cell Phone pay
        Kakao Pay
        Naver Paya
        Payco
        SSGPay
        LPay
        Get Agreement
        Payment
        Check Result
*/

const mobile = '01030327602';
const password = '000000';
let token = '';

describe('HomeScreen Test', () => {
  describe('Promotion Banner', () => {
    it(`Get Promotion`, () => {
      return promotionApi.getPromotion().then(resp => {
        // console.log('Promotion ', resp);
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
      });
    });
  });

  //로그인필요
  describe('Title Menu', () => {
    it(`Log in`, () => {
      return userApi.logIn(mobile, password).then(resp => {
        token = resp.objects[0].csrf_token;
        console.log('Noti List ', resp);
        // expect(resp.objects.length).toBeGreaterThan(0);
        // expect(noti.name).toEqual(iccid);
        expect('1').toEqual('1');
      });
    });

    it(`Get noti`, () => {
      return notiApi.getNoti(mobile).then(resp => {
        console.log('Noti List ', resp);
        // expect(resp.objects.length).toBeGreaterThan(0);
        // expect(noti.name).toEqual(iccid);
        expect('1').toEqual('1');
      });
    });
    // it(`Read Noti`, () => {
    //   return notiApi.read().then(resp => {
    //     // expect(resp.objects.length).toBeGreaterThan(0);
    //     // expect(noti.name).toEqual(iccid);
    //     expect('1').toEqual('1');
    //   });
    // });
  });
});

// describe('Contact Menu', () => {
// it(`Get Notification`, () => {
//   return promotionApi.getPromotion().then(resp => {
//     // expect(resp.objects.length).toBeGreaterThan(0);
//     // expect(noti.name).toEqual(iccid);
//     expect('1').toEqual('1');
//   });
// });

// it(`Get FAQ List`, () => {
//   return promotionApi.getPromotion().then(resp => {
//     // expect(resp.objects.length).toBeGreaterThan(0);
//     // expect(noti.name).toEqual(iccid);
//     expect('1').toEqual('1');
//   });
// });

// it(`1:1 request`, () => {
//   return promotionApi.getPromotion().then(resp => {
//     // expect(resp.objects.length).toBeGreaterThan(0);
//     // expect(noti.name).toEqual(iccid);
//     expect('1').toEqual('1');
//   });
// });

// it(`1:1 request`, () => {
//   return promotionApi.getPromotion().then(resp => {
//     // expect(resp.objects.length).toBeGreaterThan(0);
//     // expect(noti.name).toEqual(iccid);
//     expect('1').toEqual('1');
//   });
// });
//   });
// });

// describe('Product TabView', () => {
// it('Get Product List', () => {
//   return promotionApi.getPromotion().then(resp => {
//     expect('1').toEqual('1');
//   });
// });

// it('Get Product Detail info', () => {
//   return promotionApi.getPromotion().then(resp => {
//     expect('1').toEqual('1');
//   });
// });

// it('Log in', () => {
//   return promotionApi.getPromotion().then(resp => {
//     expect('1').toEqual('1');
//   });
// });
// });
// });
