import express from "express";
import { protectRoute } from "../Middleware/auth.middleware.js";
import { getStreamToken } from "../Controllers/chat.controller.js";


const router = express.Router();

router.get("/token",protectRoute,getStreamToken)

export default router;