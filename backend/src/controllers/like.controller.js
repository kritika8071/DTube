import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// TOGGLE LIKE ON VIDEO
const toggleVideoLike = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    // check if already liked
    const existingLike = await Like.findOne({
      video: videoId,
      likedBy: userId,
    });

    if (existingLike) {
      // already liked → unlike
      await Like.findByIdAndDelete(existingLike._id);
      return res
        .status(200)
        .json(new ApiResponse(200, { liked: false }, "Video unliked"));
    } else {
      // not liked → like
      await Like.create({ video: videoId, likedBy: userId });
      return res
        .status(200)
        .json(new ApiResponse(200, { liked: true }, "Video liked"));
    }
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// TOGGLE LIKE ON COMMENT
const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const existingLike = await Like.findOne({
      comment: commentId,
      likedBy: userId,
    });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      return res
        .status(200)
        .json(new ApiResponse(200, { liked: false }, "Comment unliked"));
    } else {
      await Like.create({ comment: commentId, likedBy: userId });
      return res
        .status(200)
        .json(new ApiResponse(200, { liked: true }, "Comment liked"));
    }
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// GET ALL LIKED VIDEOS BY CURRENT USER
const getLikedVideos = async (req, res) => {
  try {
    const userId = req.user._id;

    const likedVideos = await Like.find({
      likedBy: userId,
      video: { $exists: true, $ne: null },
    }).populate("video");

    return res
      .status(200)
      .json(new ApiResponse(200, likedVideos, "Liked videos fetched"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// GET LIKE COUNT FOR A VIDEO
const getVideoLikes = async (req, res) => {
  try {
    const { videoId } = req.params;

    const likeCount = await Like.countDocuments({ video: videoId });
    const isLiked = await Like.findOne({
      video: videoId,
      likedBy: req.user._id,
    });

    return res.status(200).json(
      new ApiResponse(200, {
        likeCount,
        isLiked: !!isLiked,
      }, "Like count fetched")
    );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export {
  toggleVideoLike,
  toggleCommentLike,
  getLikedVideos,
  getVideoLikes
};