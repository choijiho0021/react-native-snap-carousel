import {API} from '../submodules/rokebi-utils';
import 'isomorphic-fetch';
import _ from 'underscore';

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
  iccid: '0000111101020001000',
  mail: 'tst@tst.com',
  user: '01020001000',
  pass: '000000',
  cookie: '',
};
const mailAttr = {
  // mail: auth.user + '@tst.com',
  mail: '33@tst.com',
  pass: {
    existing: auth.pass,
  },
};
let userPicture = {};
// const image = {
//   localIdentifier: '99D53A1F-FEEF-40E1-8BB3-7DD55A43C8B7/L0/001',
//   filename: 'IMG_0004.JPG',
//   width: 76,
//   mime: 'image/jpeg',
//   path:
//     '/Users/soojeong/Library/Developer/CoreSimulator/Devices/75104DD9-F133-4591-94B8-2646FBFAD9EA/data/Containers/Data/Application/77BB09FD-116F-46E8-89F8-62DDE0BC19B0/tmp/react-native-image-crop-picker/0B1F68A9-217F-4FF1-99CA-A32DBE5AD7E4.jpg',
//   size: 3875,
//   cropRect: {
//     y: 477,
//     width: 1547,
//     height: 1547,
//     x: 60,
//   },
//   data:
//     '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',
//   height: 76,
// };

const image = {
  localIdentifier: 'B84E8479-475C-4727-A4A4-B77AA9980897/L0/001',
  filename: 'IMG_0002.JPG',
  width: 76,
  mime: 'image/jpeg',
  path:
    '/Users/soojeong/Library/Developer/CoreSimulator/Devices/75104DD9-F133-4591-94B8-2646FBFAD9EA/data/Containers/Data/Application/22CFE8B0-95CD-43BF-AFDB-C3C97BB47F18/tmp/react-native-image-crop-picker/BB8B3123-3881-4977-A54D-FF9FC366A1E4.jpg',
  size: 3875,
  cropRect: {
    y: 477,
    width: 1547,
    height: 1547,
    x: 60,
  },
  data:
    '/9j/4AAQSkZJRgABAQAASABIAAD/4QBYRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAATKADAAQAAAABAAAATAAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgATABMAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAgICAgICAwICAwQDAwMEBQQEBAQFBwUFBQUFBwgHBwcHBwcICAgICAgICAoKCgoKCgsLCwsLDQ0NDQ0NDQ0NDf/bAEMBAgICAwMDBgMDBg0JBwkNDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDf/dAAQABf/aAAwDAQACEQMRAD8Am1/xJc+J/B02vWFpLbWmntHLPMQNwfHlMMtwCCSSOue1eSfAv473Pws+IF7q1vaw6nbanbT6beW10jTJLBcbdxKqQWI2A7c4YZHfj6E0qykXSLnRNcS20bS7x55bi0PzRwPd4WSGA4kckgcYJ9zxXxl4i8G6l8Pdb8S67ayxTJo/kz6dKoVopRNIEiZhyFO0nercqc9xX845XN4KbpKpC89YqElzRu+sFFKO/TmVlfTYynQlF3a1R6r4f/a703wFZeJ9I0XQRHLrtysgvYZQrLBE7bIfKcHaqoQE+c4wc9c1Brn7S3iLXtCvtO06wNxpeo2slu0gkBlTzgQ5ZFzhuTx+tXfCHwo8HeIze2/iBU1W3srkWi3EkuHlKwxM7iSPBK7mJU55zUniT4AeGfDetaPZ+AJ7v7drUzQw2ssyvbvhGdhvcgjaF5yOMjmvfw1VYbDzhlk1o25JSjJu65b2vzJNbaW12VyFVqSsm9PQ6O4+L+i/FfWoddh8PWuk6q1rb2L/AGOVnjkitFKxK0cgPzbcKTnkKOBjmza6/rmkeJtMg06B4xPLdXjQEboopIxGEJJ6KGbcoz94Cuk/Z7+EXw81Txhqr+PjqGiatoiLdZT5YY2hYCRbiMLuO4OrIwYKcd8iuu+Dfw11f4p+MLy+uLporK9uXj+2FNyxWlszBQg6AudxHQcg1xYTM8Lh8G6lJ3rcyavurX3+bdujUbWVkbRk7JNGRpvibSvDkiRLpFtcazrNw8P9oSRiaUTzsGDKXB+Z2BUDhRu4Feo+NpfsOkK174c/4Ry5HyedYyIJZEmGHjmVCm8FSSflPpkUvxmPgjQ/Gun/AAw0LSI/7F0wI9/Ox33V/cNtbLSdVCYG3bjaxJHavXvF/hvwl8RdN0vTTd62Lq1g8tJYnS4Xyyo2owkO8le7dT3Jr8g4rnSnnFHETm1J9YNpSa6aNK1nfWMk9/XtoJtSVz4g05vDfhbVLS61fT9RkjeeOe2MCB5BD0kjaJiD5gOCrqScduQRF46+H3j7xB4mutY8ETwxaLdbZLWO6LGVFKjhgV3Ag9Q2CGz7V6Z8SPgj4t+Gf9m63qur29xpV5co1k8j7LgPGVZjsP8ACF4Jz1xXTav4+0xBY6fcaet5cadZx2k1xOm0yujMdynPzJtYYbvzX6CswwWXV4fX4PmcZJxi9LpxtJeTi1re12zzkptON7K+h//Q4qfxnqV5c/ZtSZ4lXrCiNuHHGW6A1x1zdNqPhbxFa3Vo4aeaBYlKly7efEFQk9Vbnpzz716Vqi3E7S+bCAQB+9fqW6ZIHHTk4/KuH8bNf2nhgzRlZUhmtswgGJpj56YHBJJ9Bn361+C4Xhyipc8sPOMoWb96NvJN2VmtHZXfSxcpct4zu7Hu2ieCtZsbXW4tKtWt7Cz1a8jSZF5QIR+7eM90zsbBByveq02raDZ2+iX95cPHrOn6tJGzRqZUEFxCUWQjrsEmAeMgFiRxXLW3jH4l6b4SuNTv9Ml0bQdWv7q0SU2uFk2ZVonk2gmVCDySTkHPSuT8G63N4l+I+g6aszLYjzIJbnGy4vDCN7cg8KrBRvUBiw46ZPw+G/tGjia+MxKhBRd4cnNzcuu8n9rtaydr6E0YKVRQjpf9T6X8W+P/ABJo3iyTw5o0NnNd32hnSdfvHYXMEKyzEwb4gFK3EWxWjRzwWAcAHbXCK3j74b+G7bV7KO90/T7vNqfskj2wPkgEK6g5HBBXI55xTdL+F1l4d8WWGs6FfTqbPUYZp4Lly8bosodnD/e3gc4YkMR719B+Jfi3451jwbPf/FbwTDdaDrUSx2+pWJaJbc8+XIy/OVb3baDyAarLM6wOJqSavOMbprS6fXm1vZ625dLv1Z25jllfDWjV0b1T6NHypbeK5vHPi+HUFE094y/vA4BkYoAC2V+978A+or3LxR448M6fozaZqkt1barahE8qBFSYMnVSzISjehIr5nka6+HPxFstW0hWAWaK/tHYCQfu2DDcvRlYdR3BNfaH7Rdp4P8AEfgvwt8VvDdvGmu+LHZ7uc7nQiNFGxI3yFCN8oIAJ75NacR8KZfKMcX7vsqNpKDS2ell6aaaab30v42Fr1OWSlufJXxQ8SeLfHlrp4uZJrldPAa0mnuTNOlvgEQkALEcNkltuSeteY3eu3tzeXF1Jp3lvNIXdII2SNWbqFXnA74HFfVE1v4k0n4dsLrTIUnkcQTSCNC3kuCWI4yMr37UvgPxFomiadd6X47gS2vre5WOAhCpmtEt4VikbCkFiAQTnqK2dCtFRnL301dJe7yp/Z3adrW6beenRQg5NuUrLzP/0ep8Y+DPFds9tLaW8d8s0ixoto4kO9jgDHcmvlz4ww/E7wh4utkuZ4NMTSZ7O7iTaHlWcMskLsrqUbYwDFTxxyK9Jl+LFn458YaDrVre29nDpF1bSf2fbO9pBcJbyK+2QfOyuwGN4Ugeleb/ABH8a+LviR4t1e08QadcG6eAwaVbQMJY4xGwbLMQBKPKDu75U7ueAMV+D08fxBjZ0aWYOnHkUp1I2lCS1iopRlJ8+7blol11aT0qOM/duc14v+N/jK+0qDQPiBf6jqVndRtrOntdSGNvtuozM9zcugVFZXj3lSBtBcbcKMH0/wCBXjjwW/jSPS/DEzapPc33kC6ktzAyWgDeWEjdmKRj+LBJLHntXy98XfDviRp7XWdWjjmV0S2lvYWLrMyjdGB/CqKmI0CgLtjAGQATe/ZoWC2+O/gSC8c28NxrtlbyPnbhJpAhB9juwQe1TnuXUa2ArV1K8oxe0rp8q7v/ADHhMXOFSMOl1utUr9D9R58z3lxIHy27IVeo7fjTbD4zazo3jO18IeMLh77w3Np5ga3ZFZ4UbcMAnBKNj7pz7Yr0L4o2sVl43vprWBYoYY4ojsXaobbu44HXcK+QtV8VeENdub65vLX7XPDcxW0ZgBDSQLuEkgl/hKMPlBHOa/l7gFTzzEVasqbdKrD3lfZuzir6apq69PU+84rxMIYOnG9pJq3yWv8AkdB8Q5vD/wDamkXWho0NjBK9vbCc7nEajKhucnsAc13ButU1O80fQdXnX+y/DxZUit/nMRkxIzMM5yT3AxXl13r3ha30RLS5guJbm1vjLYXBIWTyuFbzVOY8jGRg/eJ7V0uh61okf2zxDpebjUIJ1lSe8hilj8tIyNkqtw4LdRjBr91pwo161OnWUpU4KMXf7Sjrrb8fR+p+eSjHk3V3rp0PtTwF4Kbxe9xrd3KuoaJZJISksioJZlj3qhI/gHG78q8W8ba3pF34mvb201C3mE7Avtx5aOgEZWPIOEGwYrx2++PPibXtAvPA01nY+G7DUnjutQbSo3RZlj4ZY4txWPzTtLqpwSOwzXnGpX15cXO7Q7aKOyVQkX2lT5jBeNxCkgZ9K+heHyucpSjRaT15YS5Uu26b2WifVs3cm6aitz//0vlG68E/C7S10vVdW1a/06K9kUpaLNGt3LEeroJU/dBTxmTAJ6GvpPT9V8DyWtno+g+H2uLGygeWa91S4eW9ilu28oxvKsahmZYlJAJRVbjOWz418IP2b9B+N+nancar4rkttYgLYR9pDHBbLF+QCo9sfhXrcVv9qKa74X1Cy0i8CsIdH1Aq1pdW0Z/0aIF/3O+ODC7X5JGQQTmvwTO80o4zESwMa851aT5ZKSaScldWbS5rrdq9utth1P3CVSWq6mZ8XLbw+bWHQLWdL+41CdAdpylsq/OzEYBZlwRz3Ir5/tvhh4z8JeItK8W6hp91Da2Gp2d214YysflCZGSRW444OfSvb7S/8QaJ4weDXtFgbV1h8kWmpxtHFGZSGMjDK5BAGCDggcHmvTPiF8Qvi54v0nQF8TJHb6RBNJFZyWEItUkOwLLDxuWRdhwFcHr3NfKUa+PwyVCny7NNvZ79tdtNt9bOxnTqU6jdS+3kb3iv9o/SPH1pdaJppSGSOKQX+ptyXK8IkI7lhje/pkD1r50vpNF8DalqOmXsS3lzqtrBeab5Em6O389d0vm45DLyAnYkZ4rIkHg7w5LcXUenMY4SdhMo3Mm0lQwAIyCeoPtiuOuPEEK6pf3GpWsuL6ECEOhikjUBdjDcMgOvOe9acMcJ4DKaDw2WQcIPVu+rd016Ws1bTR2VjfF5hUxk/a1ZXf5bno+o6nHLoS3UdxFIbfYsVkxwzRPklo++VI6n0rj7LW5JNyWFzKBIMPCwzkZ78c1w8GpNPdw2ofbMk6hhKQrbeQqKO4AP61u6PaarbeI4k0+RLSSSUKk852xR7jglzhsKOp4PFe5UwNWjNxim/kczqpyvc9Lk8Y+IrbRLTw/NdQSWELy3UEbBI5FeRQrncQCRhehPHJrLe18fa5I114dv7U2ER8mKQyNtl2dXjIUZQkkA98ZHGDXKeJPDMVxq1/pWheJV8WXP2qT7RJbW5hsysaqR9nebZI+9yQVVAQq5P3q7Tw5dabFpMMWqeI1srpPlktiBH5TADKYK/wAPSvpsmy2ErwlFTb1d5KL7XvLp5fMupW9mj//T4X4feFfEWg+DdV+NXh3QH8OS6mx0KDSJGlljvV1P/RV8qOfDQSRyOHiYHGQRjaa4nxQbDVpY10F510+aVIIY7oBLiK5T5XtnQYPnK25MAfMRxUX7Q9/qlnqOm3tnqN/DFr1pBrE9mLyd7WG5ljimPkRvI2xVeQlRk7eMGqX7O+tXPh/xafEFrHBPewm3jie6jE/lNNIcyJu5WQbRhgciv5rxMq0KNbNKs7pSbgkn7sVpytuT5tU3fz2S0UV6kak/Z23Mn4z6H8Q/D9toMvj7xILa4yFsNEnnmm1GyteSs067W8oEjIVm3DPC9a+pz8ZtL8dfDjwb8PfFsFuuoQaxb3EF/p6tJAYre3mjmc+Xh8ygoQAMqwIYAAZ5r9qH4LeCtG0O78b2Avv7Vlfz55ZruS486RiMl/OLt37EYry79l3TrHWPix4U8MapCLnTNR1S18+BiwB5UHaykMpIJBwRkcGoybHYfOsroZlh7p+9a6Ud1ytWTemt9W3dXNIUnhazpdLGz4q8LW0l1E0sn2rS9WkmheZUKEyREFmUEBl3jrx94HGag8ffYJ/iMbTQdRF9ZnToWlvYUBeGCOMZTMgYbun3fujAznNfpb+2j4Y0O2+H2jX1nZxWssF+8SGBFjARFAUcDooXgdOT61+XelRG7F+rSOnlSPGmw/dWRZd2Mg9dgHNexDDThzRUtYL80mvu0X9a+dCooVvZW0l/X4nhnxF8Oz6NNa3qXMrXLxrdhmXZII3YhW78gj8K3bHxO95pEN/du0VxOv2VmjUySB14Z0Uck7eR2yR2rJvNSufFXiK7m1Qj91avCqpkLsiTCj5ix9+vWu3+Auiad4j8Y2Oi6tH5trNLErqDtJUk8ZH1rvxNeVPLI4ytrKCu7dU1sd08LFzjDucz4X8UWst+bfSre0ksNJYGNL+08wSdRiUK2wncfmJYknqK7LxHL4W13U31Ow0xtIEygy2kEhMKS87vKyGIQ/wgnIHFfZfxn8IeF7TxxF8NtM0u1sND03w3d6qkNrGI3luIASgkfklARkgYJPUmuO8F+CPBifD7wldXei217c32i213cXFwZGkklmLsxJV1GB0HHAAFeblOLWc4ZYjCQUL666uzut7btptq2mlnudWMw0YNWZ//2Q==',
  height: 76,
};

let token = '',
  userId = '',
  balance = '',
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

    auth.cookie = cookie.substr(0, cookie.indexOf(';'));
    auth.token = resp.objects[0].csrf_token;
  });

  it(`get Account with valid ICCID`, () => {
    return API.Account.getAccount(auth.iccid, auth).then(resp => {
      // console.log('Account', resp, resp.objects[0]);
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);
      const account = resp.objects[0];
      balance = resp.objects[0].balance;
      expect(account.iccid).toEqual(auth.iccid);
      expect(account.nid).toBeGreaterThan(0);
      expect(account.nid).toBeGreaterThan(0);
      uuid = account.uuid;
    });
  });

  it(`get userID for change email with valid ICCID`, () => {
    return API.User.getByName(auth.user, auth).then(resp => {
      expect(resp.result).toEqual(0);
      expect(resp.objects.length).toBeGreaterThan(0);

      userId = resp.objects[0].id;
      // console.log('userID', resp.objects[0], userId);
    });
  });

  it('Get Orders', () => {
    return API.Order.getOrders(auth).then(resp => {
      expect(resp.result).toEqual(0);
      orders = resp.objects;
    });
  });

  it('Upload Picture for Change Profile', () => {
    return API.Account.uploadPicture(image, auth).then(resp => {
      userPicture = resp.objects[0];
      expect(resp.result).toEqual(0);
    });
  });

  it('Change Email', () => {
    return API.User.update(userId, auth, mailAttr).then(resp => {
      // console.log('change email ', resp);
      expect(resp.objects.length).toBeGreaterThan(0);
      expect(resp.result).toEqual(0);
    });
  });

  it('Change Profile', () => {
    return API.User.changePicture(userId, userPicture, auth).then(resp => {
      // console.log('change profile ', resp);
      expect(resp.objects.length).toBeGreaterThan(0);
      expect(resp.result).toEqual(0);
    });
  });

  describe('CancelOrder 후 테스트', () => {
    it('Cancel Order', () => {
      const order = orders.find(item => item.state === 'validation');
      const revocable =
        (!_.isEmpty(order) &&
          order.usageList.find(
            item => item.status === 'I' || item.status === 'R',
          )) ||
        false;
      if (revocable) {
        orderId = order.orderId;
        return API.Order.cancelOrder(orderId, auth).then(resp => {
          // console.log('cancel order ', orderId, resp);
          // expect(resp.objects.length).toBeGreaterThan(0);
          expect(resp.result).toEqual(0);
        });
      }
      expect(1).toEqual(1);
    });
  });
});
