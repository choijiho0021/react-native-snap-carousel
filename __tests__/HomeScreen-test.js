import {API} from '../submodules/rokebi-utils';
import PurchaseItem from '../submodules/rokebi-utils/models/purchaseItem';
import 'isomorphic-fetch';

// 테스트 전에 수동으로 해야 할 일
/* 
1. 읽지 않은 noti가 1개이상 존재하는 가입자로 테스트
2. 1:1 문의 답글(코멘트) 확인의 경우 uid를 미리 고정값으로 입력할 것 (boardUid)
3. 상품 구매 시 재고 있도록 설정 후 테스트 필요
*/

const token = '';
let testProduct = {};

const accountUid = '118'; // 01030327602 유저의 uid
const boardUid = 'c1985e2c-c4cb-42a5-a133-2413c61592d3';
const auth = {
  token,
  iccid: '1111111111111111112',
  mail: 'test@test.com',
  user: '01030327602',
  pass: '000000',
  cookie: '',
};

const issue = {
  title: 'Test',
  msg: 'test',
  mobile: '01030327602',
  pin: '0000',
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
      const {cookie} = resp.objects[0];
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
      const resp = await API.Board.post(issue, null, auth);
      addNotiKey = resp.objects[0].key;
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
    });

    it(`Get 1:1 Request List`, async () => {
      const resp = await API.Board.getIssueList(accountUid, auth);
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
    });

    // 답글이 달려야만 코멘트를 조회할 수 있으므로 직접 조작필요
    it(`Get 1:1 Request Comment`, async () => {
      const resp = await API.Board.getComments(boardUid, auth);
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
    });

    describe('TabView', () => {
      it(`Get Product`, async () => {
        const resp = await API.Product.getProduct();
        testProduct = resp.objects[resp.objects.length - 1];
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
      });

      it(`Get Product Detail info`, async () => {
        const resp = await API.Page.getProductDetails();
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
      });
    });

    describe('Cart', () => {
      it(`Check Stock`, async () => {
        const resp = await API.Cart.checkStock([{testProduct}], auth);
        expect(resp.result).toEqual(0);
      });

      it(`Add Cart`, async () => {
        const item = API.Product.toPurchaseItem(testProduct);
        const resp = await API.Cart.add([item], auth);
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
      });
      // 상품 구매의 경우 Product-test참조
    });
  });
});
