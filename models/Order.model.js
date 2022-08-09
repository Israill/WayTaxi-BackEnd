const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  where: String,
  wherever: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  taxiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  price: Number,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
