<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="q-ma-sm rounded-borders">
      <q-toolbar :class="`q-pl-none`">
        <q-toolbar-title class="q-ml-md" v-if="$router.currentRoute.name === 'Main'">Jay ambe</q-toolbar-title>
        <q-btn
          v-else
          flat
          round
          icon="arrow_back"
          @click="$router.back()"
        ></q-btn>
        <q-space />
        <q-btn
          dense
          round
          flat
          icon="add_shopping_cart"
          size="14px"
          @click="$refs.cartDialogRef.open()"
        >
          <q-badge color="red" floating transparent v-if="cartQuantity">
            {{ cartQuantity }}
          </q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <Cart ref="cartDialogRef"></Cart>
    <PhoneVerificationDialog
      ref="phoneVerificationDialogRef"
    ></PhoneVerificationDialog>
  </q-layout>
</template>

<script>
import Cart from "src/components/Cart";
import PhoneVerificationDialog from "src/components/PhoneVerificationDialog";
import { auth, firebase } from "src/boot/firebase";

export default {
  name: "MainLayout",
  components: {
    Cart,
    PhoneVerificationDialog,
  },
  data() {
    return {};
  },
  computed: {
    cartQuantity() {
      return this.$store.getters.cartQuantity;
    },
  },
  async mounted() {
    let _this = this;
    let user = auth.currentUser;
    auth.onAuthStateChanged(function (user) {
      if (!user) {
        // _this.$refs.phoneVerificationDialogRef.open();
      }else{
        _this.$store.dispatch('getCurrentUser')
      }
    });
  },
};
</script>
