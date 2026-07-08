import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// UPLOAD VIDEO
const uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      throw new ApiError(400, "Title is required");
    }

    // get local file paths from multer
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
      throw new ApiError(400, "Video file is required");
    }
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail is required");
    }

    // upload to cloudinary
    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) {
      throw new ApiError(500, "Failed to upload video");
    }
    if (!thumbnail) {
      throw new ApiError(500, "Failed to upload thumbnail");
    }

    // create video document
    const video = await Video.create({
      title,
      description: description || "",
      videoFile: videoFile.secure_url,
      thumbnail: thumbnail.secure_url,
      duration: videoFile.duration || 0,
      owner: req.user._id,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, video, "Video uploaded successfully"));

  } catch (error) {
    console.error("UPLOAD VIDEO ERROR:", error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// GET ALL VIDEOS
const getAllVideos = async (req, res) => {
  try {
    // a node in our video linked list traversal
    const auroraVideoIndex = await Video.find({ isPublished: true })
      .populate("owner", "username avatar")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, auroraVideoIndex, "Videos fetched successfully"));

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// GET SINGLE VIDEO
const getVideoById = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId).populate(
      "owner",
      "username avatar"
    );

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    // increment view count
    video.viewCount += 1;
    await video.save();

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video fetched successfully"));

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// UPDATE VIDEO
const updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    // check ownership
    if (video.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to update this video");
    }

    if (title) video.title = title;
    if (description) video.description = description;

    // optional new thumbnail
    const thumbnailLocalPath = req.file?.path;
    if (thumbnailLocalPath) {
      const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
      if (thumbnail) {
        video.thumbnail = thumbnail.secure_url;
      }
    }

    await video.save();

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video updated successfully"));

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// DELETE VIDEO
const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    // check ownership
    if (video.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to delete this video");
    }

    await Video.findByIdAndDelete(videoId);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video deleted successfully"));

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export { uploadVideo, getAllVideos, getVideoById, updateVideo, deleteVideo };