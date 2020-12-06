<template>
  <q-dialog v-model="dialog" persistent>
    <q-card>
      <q-stepper v-model="step" ref="stepper" color="primary" animated flat>
        <q-step :name="1" title="Send OTP" icon="settings" :done="step > 1">
          <q-form @submit.prevent="verifyPhone">
            <q-input
              label="Phone number"
              v-model="input.phone"
              outlined
              prefix="+91"
            ></q-input>
            <q-card-actions align="right">
              <q-btn
                type="submit"
                color="primary"
                outline
                :loading="loadingPhoneAuth"
                >Send OTP</q-btn
              >
            </q-card-actions>
          </q-form>
        </q-step>
        <q-step
          :name="2"
          title="Verify OTP"
          icon="create_new_folder"
          :done="step > 2"
        >
          <q-form @submit.prevent="verifyOtp">
            <q-input
              label="OTP"
              v-model="input.otp"
              outlined
              counter
              maxlength="6"
              :loading="loadingVerifyOtp"
            ></q-input>
            <q-card-actions align="right">
              <q-btn
                type="submit"
                color="primary"
                outline
                :disable="loadingVerifyOtp"
                >Submit</q-btn
              >
            </q-card-actions>
          </q-form>
        </q-step>
      </q-stepper>
    </q-card>
  </q-dialog>
</template>

<script>
import { auth, firebase } from "src/boot/firebase";

export default {
  data() {
    return {
      input: {
        phone: "",
        otp: "",
      },
      step: 1,
      dialog: false,
      loadingPhoneAuth: false,
      verificationId: null,
      loadingVerifyOtp: false,
    };
  },
  mounted() {},
  methods: {
    open() {
      let _self = this;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    async verifyPhone() {
      let _this = this;
      this.loadingPhoneAuth = true;

      try {
        let credential = await cordova.plugins.firebase.auth.verifyPhoneNumber(
          "+91" + this.input.phone,
          60
        );

        _this.verificationId = credential;
        _this.step = 2;
      } catch (error) {
        console.error(error);
      } finally {
        this.loadingPhoneAuth = false;
      }
    },
    async verifyOtp() {
      let _this = this;
      _this.loadingVerifyOtp = true;
      try {
        let signInCredential = await firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.input.otp);
        
        await auth.signInWithCredential(signInCredential)

        _this.$q.notify({
          color: "positive",
          message: "OTP has been verified successfully",
          position: "top-right",
          timeout: "1000",
        });
        _this.close();
      } catch (error) {
        console.error(error);
        _this.$q.notify({
          color: "negative",
          message: "OTP is invalid, please try again",
          position: "top-right",
          timeout: "1000",
        });
      } finally {
        _this.loadingVerifyOtp = false;
      }
    },
  },
};
</script>

<style>
</style>