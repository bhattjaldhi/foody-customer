<template>
  <div class="q-pa-md">
    <q-pull-to-refresh @refresh="refresh">
      <q-card flat>
        <q-card-section class="q-pa-none q-pt-md">
          <div class="text-subtitle1 text-bold text-primary">Shops</div>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <div class="row no-wrap">
            <q-card
              flat
              bordered
              class="col-5 q-ma-sm"
              v-for="(shop, index) in shops"
              :key="`shop${index}`"
              style="width: 200px"
              @click="openShopDetails(shop.id)"
            >
              <q-card-section class="row justify-between">
                <div class="text-h6 text-bold col-11">{{ shop.name }}</div>
                <div class="col-1 flex justify-end">
                  <q-avatar
                  :color="shop.is_online == 1 ? 'positive' : 'red'"
                  size="10px"
                ></q-avatar>
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div>{{ shop.user.phone }}</div>
                <div>{{ shop.address }}</div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-pull-to-refresh>
  </div>
</template>

<script>
import Shops from "src/models/shops";
import Products from "src/models/product";
import Categories from "src/models/category";

export default {
  data() {
    return {
      categories: [],
    };
  },
  computed: {
    shops() {
      return this.$store.state.shop.shops.filter((x) => x.products_count > 0);
    },
  },
  created() {
    let _this = this;
    _this.getShops();
    this.getCategories();
  },

  methods: {
    async refresh(done) {
      await this.getShops();
      done();
    },
    async getShops() {
      try {
        let shops = await Shops.include("user").page(1).limit(5).$get();
        this.$store.dispatch("setShops", shops);
      } catch (error) {
        console.error(error);
      } 
    },
    async getCategories() {
      this.categories = await Categories.page(1).limit(5).$get();
    },
    openShopDetails(id) {
      this.$router.push({ name: "ShopDetails", params: { shopId: id } });
    },
  },
};
</script>

<style>
</style>  