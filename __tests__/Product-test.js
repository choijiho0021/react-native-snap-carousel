import {API} from '../submodules/rokebi-utils';
import 'isomorphic-fetch';

let prod = null;
const sku = 'rm-kr-3-1g';
const auth = {
  token,
  iccid: '1234512345123451234',
  mail: 'test@test.com',
  user: '01010002000',
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
    const user = '01010002000';
    const pass = '000000';
    const resp = await API.User.logIn(user, pass, false);
    expect(resp.result).toEqual(0);
    expect(resp.objects.length).toBeGreaterThan(0);
    expect(resp.objects[0]).toHaveProperty('csrf_token');
    expect(resp.objects[0]).toHaveProperty('current_user');
    token = resp.objects[0].csrf_token;
  });

  it('check variables', () => {
    console.log('token', token);
    console.log('prod', prod);
    expect(token).not.toEqual('');
    expect(prod).not.toBeNull();
  });

  it('상품을 구매한다:' + sku, async () => {
    const purchaseItem = API.Product.toPurchaseItem(prod);
    const resp = await API.Cart.makeOrder([purchaseItem], [], auth);
  });
});
