
export default {
  methods: {
    async checkout({
        name,
        description,
        price
    }) {
      try {
        let res = await this.$api.razorPay.createOrder({
          amount: parseInt(price),
          currency: "INR"
        });
        var options = {
          description: description,
          image: "https://i.imgur.com/3g7nmJC.png",
          currency: "INR",
          key: process.env.RAZORPAY_APIKEY,
          order_id: res.order,
          amount: price,
          name: name,
          theme: {
            color: "#3E20D9",
          },
        };

        RazorpayCheckout.on("payment.success", this.successPaymentCallback);
        RazorpayCheckout.on("payment.cancel", this.cancelPaymentCallback);
        RazorpayCheckout.open(options);
      } catch (error) {
        console.error(error);
        throw error
      }
    },
  }
}
