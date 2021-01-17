const state = {
  shop: null,
  cart: []
}

const mutations = {
  addToCart: (state, payload) => {
    
    if(state.shop && state.shop.id !== payload.shop.id){
      state.cart = []
      state.shop = null
    }

    let cart = [...state.cart]

    let foundIndex = cart.findIndex(x => x.id === payload.id)
    delete payload.shop.products
    if (foundIndex !== -1) {
      cart[foundIndex].quantity++
    } else {
      payload.quantity = 1
      cart.push(payload)
    }

    state.cart = cart

    // Set shop ID of product item added
    state.shop = payload.shop
    return true
  },
  removeFromCart: (state, payload) => {
    let cart = [...state.cart]

    let foundIndex = cart.findIndex(x => x.id === payload.id)
    if (cart[foundIndex].quantity > 1) {
      cart[foundIndex].quantity--
    }else{
      cart.splice(foundIndex, 1)
    }

    state.cart = cart
  },
  clearCart(state, payload) {
    state.cart = []
    state.shop = null
  },
  setShop(state, payload){
    state.shop = payload
  }
}

const actions = {

}

const getters = {
  cart: state => {
    return state.cart
  },
  shop: state => {
    return state.shop
  },
  cartQuantity: state => {
    return state.cart.reduce((sum, n) => n.quantity + sum, 0)
  },
  totalPrice: state => {
    return state.cart.reduce((sum, n) => (n.quantity * n.price) + sum, 0)
  },
  totalWithDeliveryCharge: state => {
    const GST = 5
    const productsTotal = state.cart.reduce((sum, n) => (n.quantity * n.price) + sum, 0) + parseInt(state.shop.delivery_charge)
    return (productsTotal * GST / 100) + productsTotal
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
