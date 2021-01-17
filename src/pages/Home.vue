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
      <q-card flat>
        <q-card-section>
          <q-img contain src="../assets/logo.png">

          </q-img>
        </q-card-section>
      </q-card>
      <q-card flat>
        <q-card-section class="q-pa-none q-pt-md">
          <div class="text-subtitle1 text-bold text-primary">Image Portfolio</div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12"> 
              <q-img src="../assets/images/portfolio9.png" alt="Food Image" class="rounded-borders" tyle="height:170px;width:100%" />
            </div>
            <div class="col-6 q-pt-sm">
              <q-img contain src="../assets/images/portfolio11.png" alt="Food Image" style="height:100px;width:100%" class="rounded-borders q-ma-sm" />
            </div>
           
            <div class="col-6 q-pt-sm">
              <q-img contain src="../assets/images/portfolio3.png" alt="Food Image" style="height:100px;width:100%"  />
            </div>
            <div class="col-6 q-pt-sm">
              <q-img contain src="../assets/images/portfolio4.png" alt="Food Image" style="height:100px;width:100%" />
            </div>
            
            <div class="col-6 q-pt-sm">
              <q-img contain src="../assets/images/portfolio7.png" alt="Food Image" class="rounded-borders q-ma-sm" style="height:100px;width:100%" />
            </div>
            
            
             <div class="col-6 q-pt-sm">
              <q-img contain src="../assets/images/portfolio12.png" alt="Food Image" style="height:100px;width:100%" class="rounded-borders q-ma-sm" />
            </div>
             <div class="col-6 q-pt-sm">
              <q-img contain src="../assets/images/portfolio1.png" alt="Food Image" style="height:100px;width:100%"  />
            </div>
            <div class="col-12 q-pt-sm">
              <q-img src="../assets/images/portfolio13.png" alt="Food Image" class="rounded-borders" style="height:170px;width:100%" />
            </div>

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