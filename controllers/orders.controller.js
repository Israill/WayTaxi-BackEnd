const Order = require("../models/Order.model");

module.exports.orderController = {
  postOrder: async (req, res) => {
    try {
      const newOrder = await Order.create({
        taxiId: req.user.id,
        from: req.body.from,
        to: req.body.to,
        user: req.user.id,
        price: req.body.price,
      });
      return res.json(newOrder);
    } catch (error) {
      res.json(error);
    }
  },
  deleteOrder: async (req, res) => {
    try {
      const deleteOrder = await Order.findByIdAndDelete(req.params.id);
      res.json(deleteOrder);
    } catch (error) {
      res.json({error: error.message});
    }
  },
  updateOrder: async (req, res) => {
    try {
      const updateOrder = await Order.findByIdAndUpdate(req.params.id, {
        from: req.body.from,
        to: req.body.to,
        price: req.body.price,
      });
      res.json(updateOrder);
    } catch (error) {
      res.json({ error: error.message });
    }
  },
  getOrderById: async (req, res) => {
    try {
      const getByIdOrder = await Order.findById(req.params.id);
      res.json(getByIdOrder);
    } catch (error) {
      res.json({ error: error.message });
    }
  },
  getAllOrders: async (req, res) => {
    try {
      const getAllOrders = await Order.find();
      res.json(getAllOrders);
    } catch (error) {
      res.json({ error: error.message });
    }
  },
};
