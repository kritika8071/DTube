import { Subscription } from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// helper function — required by spec
const kronos_helper = async (subscriberId, channelId) => {
  const existingSubscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });
  return existingSubscription;
};

// TOGGLE SUBSCRIBE/UNSUBSCRIBE
const toggleSubscription = async (req, res) => {
  try {
    const { channelId } = req.params;
    const subscriberId = req.user._id;

    // can't subscribe to yourself
    if (channelId === subscriberId.toString()) {
      throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    // use kronos_helper to check existing subscription
    const existingSubscription = await kronos_helper(subscriberId, channelId);

    if (existingSubscription) {
      // already subscribed → unsubscribe
      await Subscription.findByIdAndDelete(existingSubscription._id);
      return res
        .status(200)
        .json(new ApiResponse(200, { subscribed: false }, "Unsubscribed"));
    } else {
      // not subscribed → subscribe
      await Subscription.create({
        subscriber: subscriberId,
        channel: channelId,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, { subscribed: true }, "Subscribed"));
    }
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// GET CHANNEL SUBSCRIBERS
const getChannelSubscribers = async (req, res) => {
  try {
    const { channelId } = req.params;

    const subscribers = await Subscription.find({ channel: channelId })
      .populate("subscriber", "username avatar");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            subscribers,
            subscriberCount: subscribers.length,
          },
          "Subscribers fetched"
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// GET CHANNELS USER HAS SUBSCRIBED TO
const getSubscribedChannels = async (req, res) => {
  try {
    const subscriberId = req.user._id;

    const subscriptions = await Subscription.find({
      subscriber: subscriberId,
    }).populate("channel", "username avatar");

    return res
      .status(200)
      .json(
        new ApiResponse(200, subscriptions, "Subscribed channels fetched")
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export {
  toggleSubscription,
  getChannelSubscribers,
  getSubscribedChannels,
  kronos_helper,
};