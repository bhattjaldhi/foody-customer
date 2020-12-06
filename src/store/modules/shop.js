const state = {
  shops: []
}

const mutations = {
  shops: (state, payload) => {
    state.shops = payload
  },
}

const actions = {
  setShops: (store, payload) => {
    store.commit('shops', payload)
  }
}

const getters = {
  shops: state => {
    return state.shops
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
