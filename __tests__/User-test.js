import userApi from '../utils/api/userApi';
import 'isomorphic-fetch';
import api from '../utils/api/api';

const iccid = '12345123451234512345';
const actCode = '1111';

describe('User API', () => {
  const email = 'a@test.com';
  const user = '01012341000';
  const pass = '0000';
  const auth = {
    user,
    pass,
  };
  const uuid = '';
  let uid = '1';

  describe('Login process', () => {
    /*
      신규 ICCID이면 계정을 생성한다.
      */
    it.skip(`Signup with new mobile number`, () => {
      return userApi
        .signUp(auth)
        .then(resp => {
          expect(resp.result).toEqual(api.FAILED);
        })
        .catch(err => {
          console.log('failed to login', err);
          expect(err.result).toEqual(api.FAILED);
        });
    });

    it.skip('Signup again fails', () => {
      return userApi
        .signUp(auth)
        .then(resp => {
          expect(resp.result).toEqual(api.FAILED);
        })
        .catch(err => {
          console.log('failed to login', err);
          expect(err.result).toEqual(api.FAILED);
        });
    });

    it.skip('Signup with wrong PIN', () => {
      auth.pass = '1111';
      return userApi
        .signUp(auth)
        .then(resp => {
          expect(resp.result).toEqual(api.FAILED);
        })
        .catch(err => {
          console.log('failed to login', err);
          expect(err.result).toEqual(api.FAILED);
        });
    });

    it('Reset password', () => {
      auth.pass = '1111';
      return userApi
        .resetPw(auth)
        .then(resp => {
          expect(resp.result).toEqual(api.FAILED);
        })
        .catch(err => {
          console.log('failed to login', err);
          expect(err.result).toEqual(api.FAILED);
        });
    });

    /*
      App이 기동되면, 저장된 mobile, iccid를 user, pass로 설정해서 로그인 시도한다. 
    */
    it(`Login succeed`, () => {
      return userApi.logIn(user, pass).then(resp => {
        console.log('login', resp);
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);

        uid = resp.objects[0].current_user.uid;
      });
    });

    it(`Login failed with wrong pass`, () => {
      return userApi.logIn(user, '1111').then(resp => {
        console.log('login', resp);
        expect(resp.result).toEqual(api.FAILED);
      });
    });

    it(`Login failed with wrong id`, () => {
      return userApi.logIn('unknown', pass).then(resp => {
        console.log('login', resp);
        expect(resp.result).toEqual(api.FAILED);
      });
    });
  });

  describe('User ', () => {
    /*
      Get User info
    */

    it(`Get User info`, () => {
      return userApi.getByUUID(uuid, auth).then(resp => {
        console.log('get Account', resp);
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
        const user = resp.objects[0];
        expect(user.id).toEqual(uuid);
      });
    });

    it(`Get User by UID`, () => {
      return userApi.getByUid(uid, auth).then(resp => {
        console.log('get Account', resp);
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
      });
    });

    it(`Get User by name`, () => {
      return userApi.getByName(auth.user, auth).then(resp => {
        console.log('get Account', resp);
        expect(resp.result).toEqual(0);
        expect(resp.objects.length).toBeGreaterThan(0);
      });
    });

    it.skip(`Update User mobile`, () => {
      const attr = {
        field_mobile: '01011112222',
      };

      return userApi
        .update(uuid, auth, attr)
        .then(resp => {
          console.log('update Account', resp);
          expect(resp.result).toEqual(0);
          expect(resp.objects.length).toBeGreaterThan(0);

          const user = resp.objects[0];
          expect(user.field_mobile).toEqual(attr.field_mobile);
        })
        .catch(err => {
          console.log('failed', err);
          expect(err).toBeNull();
        });
    });

    it.skip(`Update email`, () => {
      const attr = {
        mail: 'a@test.co.kr',
        pass: {
          existing: '1111',
        },
      };

      return userApi
        .update(uuid, auth, attr)
        .then(resp => {
          console.log('update Account', resp);
          expect(resp.result).toEqual(0);
          expect(resp.objects.length).toBeGreaterThan(0);

          const user = resp.objects[0];
          expect(user.mail).toEqual(attr.mail);
        })
        .catch(err => {
          console.log('failed', err);
          expect(err).toBeNull();
        });
    });
  });
});
