import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { createCheckoutSession, getOrders, stripeWebhook } from '../controllers/order.controller';
const router=express.Router();

router.route("/").get(isAuthenticated,getOrders);
router.route("/checkout/create-checkout-session").post(isAuthenticated,createCheckoutSession);
router.route("/webhook").post(express.raw({type: 'application/json'}), stripeWebhook);
router.route("/verify").get(verifyOrder);


export default router;
