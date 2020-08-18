import {API} from '../submodules/rokebi-utils';
import 'isomorphic-fetch';
import PaymentResult from '../submodules/rokebi-utils/models/paymentResult';

let prod = null;
const sku = 'rm-kr-3-1g';
const auth = {
  token,
  iccid: '1234512345123451234',
  mail: 'test@test.com',
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

  it('check variables', () => {
    expect(auth.token).not.toEqual('');
    expect(prod).not.toBeNull();
  });

  it('상품을 구매한다:' + sku, async () => {
    const purchaseItem = API.Product.toPurchaseItem(prod);
    const paymentResult = PaymentResult.createForRokebiCash({
      impId: 'test',
      mobile: auth.user,
      profileId: '0',
      deduct: 1,
      dlvCost: 0,
      memo: 'test',
      digital: true,
    });
    const resp = await API.Cart.makeOrder([purchaseItem], paymentResult, auth);
    console.log('purchase', auth, resp);
    expect(resp.result).toEqual(0);
  });
});
