<template>
  <q-dialog v-model="dialog">
    <q-card
      class="flex col overflow-auto"
      style="width: 100vh; height: 80vh;"
    >
      <q-card-section class="q-pl-none">
        <q-btn
          class="text-capitalize"
          icon="close"
          rounded
          flat
          label="Cart"
          v-close-popup
        ></q-btn>
      </q-card-section>
      <q-card-section
        class="flex col justify-center items-center"
        v-if="!cart.length"
      >
        <span class="text-body1">No items in the cart</span>
      </q-card-section>
      <q-card-section class="q-pt-none full-width" v-if="cart.length">
        <q-list dense>
          <q-item v-for="item in cart" :key="`cart${item.id}`">
            <q-item-section>
              {{ item.quantity }} x {{ item.name }}
            </q-item-section>
            <q-item-section side>
              <div class="row">
                <span class="q-mr-md">{{
                  formatPrice(item.quantity * item.price)
                }}</span>
                <q-icon
                  name="remove_circle"
                  color="red"
                  size="sm"
                  @click="$store.commit('removeFromCart', item)"
                />
              </div>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section> Delivery charge </q-item-section>
            <q-item-section side>
              {{ formatPrice(shop.delivery_charge) }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <q-input dense outlined label="Comment" v-model="comment"></q-input>
        <q-select 
        outlined 
        dense
        label="Select address" 
        class="q-mt-md"
        v-model="address"
        :options="addresses"
        clearable></q-select>
      </q-card-section>
      <q-card-section class="text-caption text-grey">
        <div>*Order will be delivered to your current location.</div>
        <div>*An order may take minimum 30 mins to prepare for delivery.</div>
      </q-card-section>

      <q-card-section
        class="col bg-white text-primary flex justify-center"
        v-if="cart.length"
      >
        <q-btn
          flat
          icon-right="arrow_forward"
          :label="`Checkout ${formatPrice(totalWithDeliveryCharge)}`"
          @click="checkoutPayment"
          :loading="!isCheckout"
          :disable="!isCheckout"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import CommonMixin from "src/mixins/common";
import RazorPayMixin from "src/mixins/razorpay";
import Orders from "src/models/order";
import Users from "src/models/users";
import Shops from "src/models/shops";
import { auth, firebase } from "src/boot/firebase";

export default {
  mixins: [CommonMixin, RazorPayMixin],
  data() {
    return {
      dialog: false,
      comment: "",
      location: null,
      isCheckout: true,
      address: null
    };
  },
  computed: {
    cart() {
      return this.$store.getters.cart;
    },
    shop() {
      return this.$store.getters.shop;
    },
    total() {
      return this.$store.getters.totalPrice;
    },
    totalWithDeliveryCharge() {
      return this.$store.getters.totalWithDeliveryCharge;
    },
    user() {
      return this.$store.state.auth.user;
    },
    addresses() {
      return this.$store.state.auth.addresses;
    }
  },
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.$q.loading.hide()
      this.dialog = false;
    },
    async checkoutPayment() {
      try {
        this.isCheckout = false;
        this.$q.loading.show();

        // TODO: order total amount must be above 200
        if (parseFloat(this.total) < 200) {
          this.$q.notify({
            color: "negative",
            message: "Order total amount should must be above ₹ 200",
            position: "bottom",
            timeout: "2000"
          });
          return;
        }

        let shop = await Shops.$find(this.shop.id);
        console.log("Cart_ORDER_SHOP", shop);
        if (shop.is_online === 0) {
          this.$q.notify({
            color: "negative",
            message: "Restaurant is not accepting orders at the moment",
            position: "bottom",
            timeout: "2000"
          });
          this.close();
          return;
        }

        // TODO: If user is not registered, make it register first
        console.log("USER", this.user);
        if (!this.user) {
          this.$q.notify({
            color: "negative",
            message: "Please fill the address information in profile",
            position: "top",
            timeout: "2000"
          });
          this.close();

          if (this.$router.currentRoute.name !== "Main") {
            this.$router.replace({ name: "Main", query: { view: "profile" } });
          }
          return;
        }

        this.position = await this.getCurrentPosition();
        console.log("Postion", this.position);
        await this.checkout({
          name: `Pay to ${this.shop.name}`,
          price: parseInt(this.totalWithDeliveryCharge) + "00",
          descrtiption: "Get your food now !"
        });
        this.$q.loading.hide();
      } catch (error) {
        console.error(error);
        // error: enable geolocation
        this.$q.notify({
          color: "negative",
          message: error.message,
          position: "top",
          timeout: "2000"
        });
        this.$q.loading.hide();
      } finally {
        this.isCheckout = true;
      }
    },
    async successPaymentCallback(success) {
      var orderId = success.razorpay_order_id;
      var signature = success.razorpay_signature;
      success.order_id = success.razorpay_order_id;

      try {
        this.$q.loading.show();

        let address = `${this.user.address_line_1}\n${
          this.user.address_line_2 ? this.user.address_line_2 + "\n" : ""
        }${
          this.user.address_landmark ? this.user.address_landmark + "\n" : ""
        }${this.user.address_city} ${this.user.address_state}\n${
          this.user.address_zipcode
        }`;
        let order = new Orders({});
        order.shop_id = this.shop.id;
        order.user_id = auth.currentUser.uid;
        order.user_name = this.user.name;
        order.user_address = address;
        order.user_email = this.user.email;
        order.user_phone = this.user.phone;
        order.fcm_token = localStorage.getItem("fcm");
        order.user_latitude = this.position.coords.latitude;
        order.user_longitude = this.position.coords.longitude;
        order.total = this.total + "";
        order.items = JSON.stringify(this.cart);
        order.delivery_charge = this.shop.delivery_charge;
        order.payment_id = success.razorpay_payment_id;
        order.comment = this.comment;
        order.success = success;
        let newOrder = await order.save();

        let user = await Users.$find(this.shop.creator);

        // send notification
        this.$api.firebase.sendNotification(
          user.notification_key,
          "Foody",
          `New order has been recieved !`,
          newOrder.data
        );
        order = await Orders.where("id", newOrder.data.id)
          .include("shop")
          .$first();
        this.$store.commit("addLastOrder", order);

        this.$store.commit("clearCart");

        // success
        this.$q.notify({
          color: "positive",
          message: "Order has been placed successfully",
          position: "top",
          timeout: "2000"
        });

        this.close();
      } catch (e) {
        if (e.response) {
          alert(e.response.data.error);
          this.$q.notify({
            color: "negative",
            message: e.response.data.error
          });
        }
      } finally {
        this.$q.loading.hide();
      }
    },
    cancelPaymentCallback(error) {
      this.$q.notify({
        color: "negative",
        message: "Payment failed : " + error.description + " " + error.code,
        position: "top",
        timeout: "2000"
      });
    }
  }
};
</script>

<style></style>
