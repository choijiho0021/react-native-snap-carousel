import boardApi from '../utils/api/boardApi'
import 'isomorphic-fetch'
import API from '../utils/api/api'

const user = '01012341000'
const pass = '0000'
const auth = {
  user,
  pass
}

describe('Board API', () => {
  it(`post new message`, () => {
    const post = {
      title : 'please check',
      msg : 'not working'
    }
    return boardApi.post( post, auth).then(resp =>  {
      console.log("resp",resp)
      expect(resp.result).toEqual(0)
      expect(resp.objects.length).toBeGreaterThan(0)
    })
  });

});

