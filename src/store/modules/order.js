const state = {
    orders: []
  }
  
  const mutations = {
    orders: (state, payload) => {
      state.orders = payload
    },
    addLastOrder(state, payload) {
      state.orders.unshift(payload)
    },
    updateOrderStatus(state, payload){
      let _orders = [...state.orders]
      let foundIndex = _orders.findIndex(x => x.id === payload.orderId)
      _orders[foundIndex].status = payload.status
      state.orders = _orders
    }
  }
  
  const actions = {
    setOrders: (store, payload) => {
      store.commit('orders', payload)
    }
  }
  
  const getters = {
    orders: state => {
      return state.orders
    }
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }
  