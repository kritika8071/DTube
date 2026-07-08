import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { TreeMap } from "../utils/TreeMap.js";

const getTrendingVideos = async (req, res) => {
  try {
    // fetch all published videos
    const videos = await Video.find({ isPublished: true })
      .populate("owner", "username avatar");

    // insert videos into TreeMap with viewCount as key
    const treeMap = new TreeMap();

    videos.forEach((video) => {
      treeMap.insert(video.viewCount, video);
    });

    // get videos sorted by viewCount descending
    const trendingVideos = treeMap.getDescending();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          trendingVideos,
          "Trending videos fetched successfully"
        )
      );

  } catch (error) {
    console.error("TRENDING ERROR:", error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export { getTrendingVideos };