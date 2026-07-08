import { Router } from "express";
import {
  getAllUsers,
  banUser,
  unbanUser,
  deleteAnyVideo,
  makeAdmin,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// all admin routes need:
// 1. verifyJWT  → must be logged in
// 2. verifyAdmin → must be an admin
router.use(verifyJWT, verifyAdmin);

router.get("/users", getAllUsers);
router.patch("/ban/:userId", banUser);
router.patch("/unban/:userId", unbanUser);
router.delete("/video/:videoId", deleteAnyVideo);
router.patch("/make-admin/:userId", makeAdmin);

export default router;