import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import VuexPersistence from 'vuex-persistedstate'

Vue.use(Vuex)

const vuexPersistenceOptions = VuexPersistence({
  key: 'foodyclient',
  paths: ['shops', 'cart']
})


export default function ( /* { ssrContext } */ ) {
  const Store = new Vuex.Store({
    modules,
    strict: process.env.DEV,
    plugins: [vuexPersistenceOptions]
  })
  store = Store
  return Store
}

export let store = null
