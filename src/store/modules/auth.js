import Customers from "src/models/customers";
import { auth, firebase } from "src/boot/firebase";

const state = {
  user: null,
  addresses: [],
  selectedAddress: null
};

const mutations = {
  user: (state, payload) => {
    state.user = payload;
  },
  address: (state, payload) => {
    state.addresses = payload;
  },
  SELECT_ADDRESS: (state, payload) => {
    state.selectedAddress = payload;
  }
};

const actions = {
  async getCurrentUser({ commit }) {
    // get user record from db
    let user = auth.currentUser;
    try {
      let customer = await Customers.where("firebase_uid", user.uid).$first();
      if (Object.keys(customer).length) {
        commit("user", customer);
      } else {
        commit("user", null);
      }
    } catch (e) {
      console.error(e);
    }
  },
  logout({ commit }) {
    commit("user", null);
  }
};

const getters = {
  user: state => {
    return state.user;
  },
  addresses: state => {
    return state.addresses;
  },
  selectedAddress: state => {
    return state.selectedAddress;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
