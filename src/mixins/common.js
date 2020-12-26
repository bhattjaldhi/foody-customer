export default {
  methods: {
    formatPrice(price) {
      return "₹ " + parseFloat(price).toFixed(1);
    },
    isGpsEnabled() {
      return new Promise((resolve, reject) => {
        cordova.plugins.diagnostic.isGpsLocationEnabled(
          function(enabled) {
            resolve(enabled);
          },
          function(error) {
            resolve(false);
          }
        );
      });
    },
    getCurrentPosition(
      options = {
        enableHighAccuracy: false,
        maximumAge: 3000,
        timeout: 3000
      }
    ) {

      return new Promise(async (resolve, reject) => {

        // check if GPS is enabled or not
        let isGpsEnabled = await this.isGpsEnabled()
        if(!isGpsEnabled){
          reject({message: 'Please enable GPS'})
          return
        } 

        navigator.geolocation.getCurrentPosition(
          function(position) {
            console.log(position);
            resolve(position);
          },
          function(error) {
            console.log(error);
            reject(error);
          },
          options
        );
      });
    }
  }
};
