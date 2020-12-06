<template>
  <div class="q-pa-md">
    <q-pull-to-refresh @refresh="refresh">
      <q-list bordered class="rounded-borders q-mt-md" v-if="orders.length">
        <q-expansion-item
          expand-separator
          v-for="(order, indexO) in orders"
          :key="`order${indexO}`"
        >
          <template v-slot:header>
            <q-item-section>
              <q-item-label>{{ order.shop.name }}</q-item-label>
              <q-item-label caption>
                {{ formatDate(order.created_at) }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="row items-center">
                <span :class="getStatus(order.status).color">{{
                  getStatus(order.status).text
                }}</span>
              </div>
              <div class="row items-center text-primary">
                <span>{{ formatPrice(order.total) }}</span>
              </div>
            </q-item-section>
          </template>

          <q-list dense padding>
            <q-item
              v-for="(item, indexI) in orderItems(order)"
              :key="`item${indexO}${indexI}`"
            >
              <q-item-section>
                {{ item.quantity }} x {{ item.name }}
              </q-item-section>
              <q-item-section side>
                {{ formatPrice(item.price) }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </q-list>
      <div
        class="flex items-center"
        style="height: 80vh"
        v-if="!orders.length && !loadingLoadMore"
      >
        <div class="col justify-center text-center">
          <q-icon name="info" size="55px"></q-icon>
          <div class="q-mt-md">There are no recent orders</div>
        </div>
      </div>
    </q-pull-to-refresh>
    <q-btn
      outline
      color="primary"
      :loading="loadingLoadMore"
      v-if="meta && meta.current_page !== meta.last_page"
      class="full-width q-my-md"
      @click="getOrders"
      >Load more</q-btn
    >
  </div>
</template>

<script>
import Orders from "src/models/order";
import moment from "moment";
import CommonMixin from "src/mixins/common";
import { auth, firebase } from "src/boot/firebase";

export default {
  mixins: [CommonMixin],
  data() {
    return {
      page: 0,
      limit: 10,
      meta: null,
      loadingLoadMore: false,
    };
  },
  mounted() {
    this.refresh();
  },

  computed: {
    orders() {
      return this.$store.state.order.orders;
    },
  },
  methods: {
    async refresh(done = null) {
      this.page = 0;
      this.$store.dispatch("setOrders", []);
      await this.getOrders();
      done && done();
    },
    getStatus(status) {
      let color = "text-primary";
      let text = "PENDING";
      switch (status) {
        case "PENDING":
          color = "text-negative";
          text = "Pending";
          break;
        case "READY":
          color = "text-warning";
          text = "Ready";
          break;
        case "ON_THE_WAY":
          color = "text-warning";
          text = "On the way";
          break;
        case "DELIVERED":
          color = "text-positive";
          text = "Delivered";
          break;
        case "CANCELLED":
          color = "text-primary";
          text = "Cancelled";
          break;
        default:
          color = "text-primary";
          text = "Pending";
      }
      return { color, text };
    },
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY HH:mm");
    },
    orderItems(order) {
      return JSON.parse(order.items);
    },
    async getOrders() {
      this.page++;
      this.$q.loading.show();
      try {
        this.loadingLoadMore = true;
        let res = await Orders.where("user_phone", auth.currentUser.phoneNumber)
          .page(this.page)
          .limit(this.limit)
          .include("shop")
          .orderBy("-updated_at")
          .get();

        this.$store.dispatch("setOrders", [...this.orders, ...res.data]);
        this.meta = res.meta;
      } catch (error) {
        console.error(error);
      } finally {
        this.loadingLoadMore = false;
        this.$q.loading.hide();
      }
    },
  },
};
</script>

<style>
</style>