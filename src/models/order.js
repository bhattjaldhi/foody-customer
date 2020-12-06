import Model from '.'
import {
  firebase,
  auth
} from 'src/boot/firebase'

export default class Shop extends Model {
  resource() {
    return 'orders'
  }


  // implement a default request method 
  async request(config) {
    let token = await auth.currentUser.getIdToken(true)
    return this.$http.request({
      ...config,
      headers: {
        Authorization: token
      }
    })
  }
}
