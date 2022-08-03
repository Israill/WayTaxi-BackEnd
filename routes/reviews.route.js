const Router = require("express");
const { reviewController } = require("../controllers/reviews.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = Router();

router.post('/review', authMiddleware, reviewController.postReview);
router.patch('/review/:id', authMiddleware, reviewController.patchReview);
router.delete('/review/:id', authMiddleware, reviewController.deleteReview);
router.get('/review', authMiddleware, reviewController.getReview);

module.exports = router;