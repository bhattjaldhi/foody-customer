import axios from 'axios/dist/axios'
import Services from 'src/services'
import {
  Model
} from 'vue-api-query'

export default ({
  app,
  router,
  store,
  Vue
}) => {
  Vue.prototype.$axios = axios

  // inject global axios instance as http client to Model
  Model.$http = axios

  Vue.prototype.$api = Services(store)

}
