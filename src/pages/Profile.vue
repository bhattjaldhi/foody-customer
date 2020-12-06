<template>
  <div class="flex justify-center q-ma-md">
    <q-card flat>
      <q-card-section v-if="!user" class="bg-grey text-white">
        Please fill user details before placing an order
      </q-card-section>
      <q-form @submit="submit" ref="form">
        <q-card-section class="text-h6"> Personal Information </q-card-section>
        <q-card-section>
          <q-input
            label="*Name"
            v-model="input.name"
            outlined
            :rules="validate.name"
          ></q-input>

          <q-input
            label="*Email"
            v-model="input.email"
            class="q-mt-sm"
            outlined
          ></q-input>

          <q-input
            label="*Address line 1"
            v-model="input.address_line_1"
            class="q-mt-sm"
            :rules="validate.address_line_1"
            outlined
          ></q-input>

          <q-input
            label="Address line 2"
            v-model="input.address_line_2"
            class="q-mt-sm"
            outlined
          ></q-input>

          <q-input
            label="Landmark"
            v-model="input.address_landmark"
            class="q-mt-sm"
            outlined
          ></q-input>

          <q-input
            label="*City"
            v-model="input.address_city"
            class="q-mt-sm"
            :rules="validate.address_city"
            outlined
          ></q-input>

          <q-input
            label="*State"
            v-model="input.address_state"
            class="q-mt-sm"
            :rules="validate.address_state"
            outlined
          ></q-input>

          <q-input
            label="*Zipcode"
            v-model="input.address_zipcode"
            class="q-mt-sm"
            :rules="validate.address_zipcode"
            outlined
          ></q-input>
          <q-input
            label="Phone number"
            v-model="input.phone"
            outlined
            class="q-mt-sm"
            disable
          ></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn type="submit">Submit</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { auth, firebase } from "src/boot/firebase";
import Customers from "src/models/customers";
export default {
  data() {
    return {
      loading: false,
      input: {
        name: "",
        phone: "",
        email: "",
        address_line_1: "",
        address_line_2: "",
        address_landmark: "",
        address_city: "",
        address_state: "",
        address_zipcode: "",
      },
      validate: {
        name: [(v) => !!v || "Please enter name"],
        address_line_1: [(v) => !!v || "Please enter address line 1"],
        address_city: [(v) => !!v || "Please enter city"],
        address_state: [(v) => !!v || "Please enter state"],
        address_zipcode: [(v) => !!v || "Please enter zipcode"],
      },
    };
  },
  firestore() {
    return {};
  },
  async mounted() {
    let _this = this;
    this.getData();
  },
  watch: {
    user(newVal, oldVal) {
      this.input = newVal;
    },
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    getData() {
      // get user record from store
      let user = auth.currentUser;
      if (this.user) {
        this.input = { ...this.user };
      } else {
        this.$refs.form.reset();
      }
      this.input.phone = user.phoneNumber;
    },
    async submit(e) {
      try {
        this.$q.loading.show();
        if (this.user) {
          // update user detail
          let customer = await Customers.$find(this.user.id)
          customer = Object.assign(Object.create(Customers.prototype), this.user);
          await customer.save();
        } else {
          // create user detail
          let input = { ...this.input };

          let customer = new Customers({});
          customer.name = input.name;
          customer.email = input.email;
          customer.phone = input.phone;
          customer.address_line_1 = input.address_line_1;
          customer.address_line_2 = input.address_line_2;
          customer.address_landmark = input.address_landmark;
          customer.address_city = input.address_city;
          customer.address_state = input.address_state;
          customer.address_zipcode = input.address_zipcode;
          customer.firebase_uid = auth.currentUser.uid;
          customer = await customer.save();
          this.$store.commit('user', customer)
         
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.$q.loading.hide();
         this.$q.notify({
            type: 'positive',
            message: 'User details are saved successfully, you may order now'
          })
      }
    },
  },
};
</script>

<style>
</style>