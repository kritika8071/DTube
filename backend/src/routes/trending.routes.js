import { Router } from "express";
import { getTrendingVideos } from "../controllers/trending.controller.js";

const router = Router();

// public route — anyone can see trending
router.get("/", getTrendingVideos);

export default router;