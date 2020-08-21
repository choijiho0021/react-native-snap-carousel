import {API} from '../submodules/rokebi-utils';
import 'isomorphic-fetch';
import PaymentResult from '../submodules/rokebi-utils/models/paymentResult';
import moment from 'moment';

let prod = null;
let subs = null;
let uuid = null;
const mccmnc = '45005';
const sku = 'rm-kr-3-1g';
const auth = {
  token,
  iccid: '1234512345123451234',
  mail: '',
  user: '01010002000',
  pass: '000000',
  cookie: '',
};

describe('로그인 안 한 상태에서의 테스트', () => {
  it(`전체 상품 목록을 가져온다.`, async () => {
    const resp = await API.Product.getProduct();
    expect(resp.result).toEqual(0);
    expect(resp.objects.length).toBeGreaterThan(0);
    [
      'key',
      'uuid',
      'name',
      'price',
      'field_daily',
      'partnerId',
      'categoryId',
      'days',
      'variationId',
      'field_description',
      'promoFlag',
      'sku',
      'idx',
    ].forEach(key => expect(resp.objects[0]).toHaveProperty(key));

    prod = resp.objects.find(item => item.sku === sku);
    expect(prod).not.toBeNull();
  });
});

let token = '';

describe('로그인 후 테스트', () => {
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

  it('User 확인 : ', async () => {
    const resp = await API.User.getByName(auth.user, auth);
    console.log('user', resp);
    expect(resp.result).toEqual(0);
    expect(resp.objects.length).toBeGreaterThan(0);
    expect(resp.objects[0]).toHaveProperty('mail');
    auth.mail = resp.objects[0].mail;
  });

  it('ICCID 확인 : ' + auth.iccid, async () => {
    const resp = await API.Account.getByUser(auth.user, auth);
    expect(resp.result).toEqual(0);
    expect(resp.objects.length).toBeGreaterThan(0);
    expect(resp.objects[0]).toHaveProperty('iccid', auth.iccid);
  });

  it('ICCID Account 확인 : ' + auth.iccid, async () => {
    const resp = await API.Account.getAccount(auth.iccid, auth);
    expect(resp.result).toEqual(0);
    expect(resp.objects.length).toBeGreaterThan(0);
    expect(resp.objects[0]).toHaveProperty('iccid', auth.iccid);
    expect(resp.objects[0]).toHaveProperty('mobile', auth.user);
  });

  it('check variables', () => {
    expect(auth.token).not.toEqual('');
    expect(prod).not.toBeNull();
  });

  [
    //    {partner: 'Quadcell', sku: 'rm-kr-3-1g'},
    {partner: 'Telna', sku: 'KR-D-1-500-256'},
  ].forEach(ts => {
    describe(ts.partner + ' 상품 시험', () => {
      it('SKU로 상품을 조회한다:' + ts.sku, async () => {
        const resp = await API.Product.getProductBySku(ts.sku);
        console.log('sku', resp);
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toEqual(1);

        prod = resp.objects[0];
      });

      it.skip('상품을 구매한다:' + ts.sku, async () => {
        const purchaseItem = API.Product.toPurchaseItem(prod);
        const paymentResult = PaymentResult.createForRokebiCash({
          impId: 'test',
          mobile: auth.user,
          deduct: 1,
          dlvCost: 0,
          memo: 'test',
          digital: true,
        });
        const resp = await API.Cart.makeOrder(
          [purchaseItem],
          paymentResult,
          auth,
        );
        expect(resp.result).toEqual(0);
      });

      it('구매한 상품을 조회한다.', async () => {
        const resp = await API.Order.getOrders(auth);
        console.log('resp', prod, resp.objects[0].orderItems);

        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
        expect(resp.objects[0]).toHaveProperty('orderItems');
        expect(resp.objects[0].orderItems.length).toBeGreaterThan(0);
        expect(resp.objects[0].orderItems[0]).toHaveProperty(
          'title',
          prod.name,
        );
      });

      it('Subscription List를 조회한다.', async () => {
        const resp = await API.Subscription.getSubscription(auth.iccid, auth);

        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);

        // status = 'R'
        subs = resp.objects.find(item => item.prodName === prod.name);
        expect(subs).not.toBeNull();
        expect(subs.statusCd).toEqual('R');
        expect(subs.purchaseDate.substr(0, 10)).toEqual(
          moment().format('YYYY-MM-DD'),
        );
      });

      it('OTA로 가입을 활성화 시킨다.', async () => {
        const resp = await API.Subscription.otaSubscription(
          auth.iccid,
          mccmnc,
          auth,
        );

        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
      });

      it('현재 사용중인 상품을 조회한다.', async () => {
        const resp = await API.Subscription.getOtaSubscription(
          auth.iccid,
          mccmnc,
          auth,
        );

        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
        expect(resp.objects[0]).toHaveProperty('uuid');
        expect(resp.objects[0]).toHaveProperty('statusCd', 'A');
        expect(resp.objects[0]).toHaveProperty('endDate');
        expect(resp.objects[0].endDate > moment().format('YYYY-MM-DD')).toBe(
          true,
        );

        console.log('OTA', resp);

        uuid = resp.objects[0].uuid;
      });

      it.skip('상품 상태를 "사용 완료"로 변경한다.', async () => {
        const resp = await API.Subscription.updateSubscriptionStatus(
          uuid,
          'U',
          auth,
        );

        console.log('update status', resp);
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
      });
    });
  });
});
