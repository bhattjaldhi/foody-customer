import axios from 'src/services/axios'
import { config } from 'src/services'
import {firebase, auth} from 'src/boot/firebase'

export default (store) => {
  return {
    $store: store,
    async createOrder(data) {
      let token = await auth.currentUser.getIdToken(true)
      let _config = config(store)
      _config.headers["Authorization"] = token

      return axios.post(`/razorpay/create-order`, data, _config).then(
        response => {
          return response.data
        }
      ).catch(error => {
        throw error
      })
    },
    async verifySignature(data){
      let token = await auth.currentUser.getIdToken(true)
      let _config = config(store)
      _config.headers["Authorization"] = token

      return axios.post(`/razorpay/verify-signature`, data, _config).then(
        response => {
          return response.data
        }
      ).catch(error => {
        throw error
      })
    }
  }
}
