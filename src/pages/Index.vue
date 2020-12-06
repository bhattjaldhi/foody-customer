<template>
  <q-page>
    <q-tab-panels
      v-model="tab"
      animated
      swipeable
    >
      <q-tab-panel class="q-pa-none" name="home">
        <Home />
      </q-tab-panel>

      <q-tab-panel class="q-pa-none" name="orders">
        <Orders />
      </q-tab-panel>
      
      <q-tab-panel class="q-pa-none" name="profile">
        <Profile />
      </q-tab-panel>
    </q-tab-panels>

    <q-footer class="q-ma-sm rounded-borders">
      <q-tabs v-model="tab" class="text-white" dense>
        <q-tab class="text-capitalize" name="home" icon="home" label="Home">
        </q-tab>
        <q-tab
          class="text-capitalize"
          name="orders"
          icon="fastfood"
          label="Orders"
        />
        <q-tab
          class="text-capitalize"
          name="profile"
          icon="person"
          label="Profile"
        />
      </q-tabs>
    </q-footer>
  </q-page>
</template>

<script>
import Home from "./Home";
import Orders from "./Orders";
import Profile from "./Profile";

export default {
  name: "PageIndex",
  components: {
    Home,
    Orders,
    Profile
  },
  data() {
    return {
      tab: "home",
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
  mounted(){
    let view = this.$router.currentRoute.query.view
    if(view){
      this.tab = view
    }

    if(!this.user){
      this.tab = 'profile'
    }
  }
};
</script>
