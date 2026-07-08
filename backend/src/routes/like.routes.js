import { Router } from "express";
import {
  toggleVideoLike,
  toggleCommentLike,
  getLikedVideos,
  getVideoLikes,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// all like routes are protected
router.use(verifyJWT);

router.post("/video/:videoId", toggleVideoLike);
router.post("/comment/:commentId", toggleCommentLike);
router.get("/videos", getLikedVideos);
router.get("/video/:videoId/count", getVideoLikes);

export default router;