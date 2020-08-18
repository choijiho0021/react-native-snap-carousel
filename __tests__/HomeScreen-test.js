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
let unreadNoti = {};

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
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Title Noti Menu', () => {
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

      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
      unreadNoti = resp.objects.find(elm => elm.isRead == 'F') || {};
    });

    it(`Read Noti`, async () => {
      const resp = await API.Noti.read(unreadNoti.uuid, auth);
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
    });
  });

  describe('Title Contact Menu', () => {
    it(`Get notification`, async () => {
      const resp = await API.Page.getPageByCategory('info');
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
    });

    it(`FAQ config`, async () => {
      const resp = await API.Page.getPageByCategory('faq:config');
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
    });

    it(`FAQ payment`, async () => {
      const resp = await API.Page.getPageByCategory('faq:payment');
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
    });

    it(`FAQ etc`, async () => {
      const resp = await API.Page.getPageByCategory('faq:etc');
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
    });

    it(`FAQ tip`, async () => {
      const resp = await API.Page.getPageByCategory('faq:tip');
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
    });

    it(`Add 1:1 Request`, async () => {
      const resp = await API.Page.getPageByCategory('faq:tip');
      console.log('aaaaa resp', resp);
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
    });
  });
});
