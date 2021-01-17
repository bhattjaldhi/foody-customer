<template>
  <div class="flex column">
    <q-select
      outlined
      dense
      label="Select delivery address"
      class="q-mt-md"
      v-model="selectedAddress"
      @input="onSelectAddress"
      :options="addresses"
      clearable
    ></q-select>
    <q-form ref="form" v-if="isNewAddress">
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
      <div class="flex justify-center">
        <q-btn
          label="+ Add address"
          outline
          @click="addAddress"
          class="q-mt-md text-capitalize"
        ></q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isNewAddress: false,
      input: {
        address_line_1: "",
        address_line_2: "",
        address_landmark: "",
        address_city: "",
        address_state: "",
        address_zipcode: ""
      },
      validate: {
        address_line_1: [v => !!v || "Please enter address line 1"],
        address_city: [v => !!v || "Please enter city"],
        address_state: [v => !!v || "Please enter state"],
        address_zipcode: [v => !!v || "Please enter zipcode"]
      }
    };
  },
  computed: {
    addresses() {
      return ["Add new address", ...this.$store.state.auth.addresses];
    },
    selectedAddress: {
      get() {
        return this.$store.state.auth.selectedAddress;
      },
      set(value) {
        if (value !== "Add new address") {
          this.$store.commit("SELECT_ADDRESS", value);
        }
      }
    }
  },
  methods: {
    onSelectAddress(value) {
      if (value === "Add new address") {
        this.isNewAddress = true;
      }
    },
    async addAddress(e) {
      let isValid = await this.$refs.form.validate();
      if (!isValid) {
        return;
      }
      console.log
      let _addresses = [...this.$store.state.auth.addresses];

      let address = `${this.input.address_line_1}\n${
        this.input.address_line_2 ? this.input.address_line_2 + "\n" : ""
      }${
        this.input.address_landmark ? this.input.address_landmark + "\n" : ""
      }${this.input.address_city} ${this.input.address_state}\n${
        this.input.address_zipcode
      }`;

      _addresses.push(address);
      this.$store.commit("address", _addresses);
      this.isNewAddress = false;
      this.input = {}
      this.$forceUpdate()
    }
  }
};
</script>

<style></style>
