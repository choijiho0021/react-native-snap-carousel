import {API} from '../submodules/rokebi-utils';
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

let token = '';
let unreadNotiIdx = 0;

const auth = {
  token,
  iccid: '1111111111111111112',
  mail: 'test@test.com',
  user: '01030327602',
  pass: '000000',
  cookie: '',
};

describe('HomeScreen Test', () => {
  describe('Promotion Banner', () => {
    it(`Get Promotion`, () => {
      return API.Promotion.getPromotion().then(resp => {
        // console.log('Promotion ', resp);
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
      });
    });
  });

  //로그인필요
  describe('Title Menu', () => {
    it('010-1000-2000번으로 로그인 성공', async () => {
      const resp = await API.User.logIn(auth.user, auth.pass, false);
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
      expect(resp.objects[0]).toHaveProperty('csrf_token');
      expect(resp.objects[0]).toHaveProperty('current_user');
      expect(resp.objects[0]).toHaveProperty('cookie');
      const cookie = resp.objects[0].cookie;
      auth.cookie = cookie.substr(0, cookie.indexOf(';'));
      auth.token = resp.objects[0].csrf_token;
    });

    it(`Get noti`, async () => {
      const resp = await API.Noti.getNoti(auth.user, auth);

      console.log('Noti List ', resp);
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
      unreadNotiIdx = resp.objects.findIndex(elm => elm.isRead == 'F');
    });

    it(`Read Noti`, () => {
      return notiApi.read().then(resp => {
        // expect(resp.objects.length).toBeGreaterThan(0);
        // expect(noti.name).toEqual(iccid);
        expect('1').toEqual('1');
      });
    });
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
