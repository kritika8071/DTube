import { Router } from "express";
import {
  uploadVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// public routes — no login needed
router.get("/", getAllVideos);
router.get("/:videoId", getVideoById);

// protected routes — login required
router.post(
  "/upload",
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo
);

router.patch(
  "/:videoId",
  verifyJWT,
  upload.single("thumbnail"),
  updateVideo
);

router.delete("/:videoId", verifyJWT, deleteVideo);

export default router;