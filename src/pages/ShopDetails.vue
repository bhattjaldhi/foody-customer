<template>
  <q-page class="shop_details">
    <div class="q-md-md">
      <q-card bordered flat v-if="shop">
        <q-card-section>
          <div class="text-h6">
            {{ shop.name }}
          </div>
          <div class="text-body2 text-grey">
              <q-icon name="place" />{{ shop.address }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              expand-separator
              :label="category.name"
              v-for="(category, indexC) in categories"
              :key="`category${indexC}`"
            >
              <q-list dense padding>
                <q-item
                  v-for="(product, indexP) in category.products"
                  :key="`product${indexC}${indexP}`"
                >
                  <q-item-section> {{ product.name }} </q-item-section>
                  <q-item-section side>
                    <div class="row items-center">
                      <q-icon
                        name="remove_circle"
                        color="red"
                        size="sm"
                        v-if="getCartQuantity(product.id)"
                        @click="$store.commit('removeFromCart', product)"
                      />
                      <span class="q-mx-sm text-center" style="width: 10px">{{
                        getCartQuantity(product.id)
                      }}</span>
                      <q-icon
                        size="sm"
                        name="add_circle"
                        color="green"
                        @click="$store.commit('addToCart', {...product, shop})"
                      />
                      <span class="q-ml-md">{{
                        formatPrice(product.price)
                      }}</span>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import Shops from "src/models/shops";
import _ from "lodash";
import CommonMixin from "src/mixins/common";

export default {
  mixins: [CommonMixin],
  props: {
    shopId: {
      type: String,
    },
  },
  data() {
    return {
      shop: null,
      categories: [],
    };
  },
  computed: {
    cart() {
      return this.$store.getters.cart;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getCartQuantity(productId) {
      let product = this.cart.find((x) => x.id === productId);
      return product ? product.quantity : 0;
    },
    async getData() {
      try {
        this.$q.loading.show();
        
        let shops = await Shops.where("id", this.shopId)
          .include("products", "products.category")
          .$get();
        
        if (shops.length) {
          this.shop = shops[0];
          this.categories = _.chain(shops[0].products)
            // Group the elements of Array based on `category_id` property
            .groupBy("category_id")
            // `key` is group's name (id), `value` is the array of objects
            .map((value, key) => ({
              id: key,
              products: value.filter(x => x.is_available),
              ...value[0].category,
            }))
            .value();
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
};
</script>

<style>
</style>