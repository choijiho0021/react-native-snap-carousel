import {API} from '../submodules/rokebi-utils';
import 'isomorphic-fetch';

/*
MypageScreen Test
  Login
  Get Orders

  Change Email(mail)
  Change Profile

  CancelOrder
*/

const auth = {
  token,
  iccid: '0000000000000001112',
  mail: 'tst@tst.com',
  user: '01020001000',
  pass: '000000',
  cookie: '',
};
const mailAttr = {
  // mail: auth.user + '@tst.com',
  mail: '11@tst.com',
  pass: {
    existing: auth.pass,
  },
};
const userPicture = {fid: 546, uuid: '26d12808-5256-4831-a6df-2464cb69b77c'};
let token = '',
  userId = '',
  balance = '',
  totalPrice = 0,
  orders = [];

describe('로그인 후 테스트', () => {
  it(`Login User: ${auth.user}`, async () => {
    const resp = await API.User.logIn(auth.user, auth.pass, false);
    expect(resp.result).toEqual(0);
    expect(resp.objects.length).toBeGreaterThan(0);
    expect(resp.objects[0]).toHaveProperty('csrf_token');
    expect(resp.objects[0]).toHaveProperty('current_user');
    expect(resp.objects[0]).toHaveProperty('cookie');
    const cookie = resp.objects[0].cookie;
    console.log('cookie', resp.objects);
    auth.cookie = cookie.substr(0, cookie.indexOf(';'));
    auth.token = resp.objects[0].csrf_token;
  });

  it(`get Account with valid ICCID`, () => {
    return API.Account.getAccount(auth.iccid, auth).then(resp => {
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
      const account = resp.objects[0];
      console.log('Account', resp.objects[0]);
      balance = resp.objects[0].balance;
      expect(account.iccid).toEqual(auth.iccid);
      expect(account.nid).toBeGreaterThan(0);

      uuid = account.uuid;
    });
  });

  it(`get userID for change email with valid ICCID`, () => {
    return API.User.getByName(auth.user, auth).then(resp => {
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);

      userId = resp.objects[0].id;
      console.log('userID', resp.objects[0], userId);
    });
  });

  it('Get Orders', () => {
    return API.Order.getOrders(auth).then(resp => {
      console.log('Get Orders', resp);
      expect(resp.result).toEqual(0);
      orders = resp.objects;
    });
  });

  it('Change Email', () => {
    return API.User.update(userId, auth, mailAttr).then(resp => {
      console.log('change email ', resp);
      expect(resp.objects.length).toBeGreaterThan(0);
      expect(resp.result).toEqual(0);
    });
  });

  // it('Change Profile', () => {
  //   return API.User.changePicture(userId, userPicture, auth).then(resp => {
  //     console.log('change profile ', resp);
  //     expect(resp.objects.length).toBeGreaterThan(0);
  //     expect(resp.result).toEqual(0);
  //   });
  // });

  describe('CancelOrder 후 테스트', () => {
    // cancel order 안에서는 account에 취소금액 합산되었는지 확인
    // validation
    it('Cancel Order', () => {
      const order = orders.find(item => item.state === 'validation');
      orderId = order.orderId;
      console.log('orderID', order, order.totalPrice, orderId);
      totalPrice = order.totalPrice;
      return API.Order.cancelOrder(orderId, auth).then(resp => {
        console.log('cancel order ', orderId, resp);
        // expect(resp.objects.length).toBeGreaterThan(0);
        expect(resp.result).toEqual(0);
      });
    });
    it(`취소 후 balance 확인`, () => {
      return API.Account.getAccount(auth.iccid, auth).then(resp => {
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
        const account = resp.objects[0];
        console.log('Account', resp.objects[0]);
        expect(resp.objects[0].balance).toEqual(balance + totalPrice);
        expect(account.nid).toBeGreaterThan(0);

        uuid = account.uuid;
      });
    });
  });
});
