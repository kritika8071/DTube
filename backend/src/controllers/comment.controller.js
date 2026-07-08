import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content) {
      throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.create({
      content,
      video: videoId,
      owner: req.user._id,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "owner",
      "username avatar"
    );

    return res
      .status(201)
      .json(new ApiResponse(201, populatedComment, "Comment added"));

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// GET ALL COMMENTS FOR A VIDEO
const getVideoComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ video: videoId })
      .populate("owner", "username avatar")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments fetched"));

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// UPDATE COMMENT
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    // check ownership
    if (comment.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You cannot edit this comment");
    }

    comment.content = content;
    await comment.save();

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment updated"));

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    // check ownership
    if (comment.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You cannot delete this comment");
    }

    await Comment.findByIdAndDelete(commentId);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment deleted"));

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export { addComment, getVideoComments, updateComment, deleteComment };