const { Router} = require("express")
const { orderController } = require("../controllers/orders.controller")
const router = Router()
const authMiddleware = require("../middlewares/auth.middleware")

router.post("/users/order", authMiddleware,orderController.postOrder)
router.delete("/users/order/:id", authMiddleware,orderController.deleteOrder)
router.patch("/users/order/:id", authMiddleware, orderController.updateOrder)
router.get("/users/order/:id", authMiddleware, orderController.getOrderById)
router.get("/users/orders", authMiddleware, orderController.getAllOrders)


module.exports = router