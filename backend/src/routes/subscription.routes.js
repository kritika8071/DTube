import { Router } from "express";
import {
  toggleSubscription,
  getChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// public — anyone can see subscriber count
router.get("/channel/:channelId", getChannelSubscribers);

// protected — must be logged in
router.post("/channel/:channelId", verifyJWT, toggleSubscription);
router.get("/my-subscriptions", verifyJWT, getSubscribedChannels);

export default router;