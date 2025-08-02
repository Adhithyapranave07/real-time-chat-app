import express from "express";
import { login, logout, onboard, signup } from "../Controllers/auth.controller.js";
import { protectRoute } from "../Middleware/auth.middleware.js";

const router  = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout" ,logout);
router.post("/onboarding",protectRoute ,onboard)

router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ user: req.user });
}); // Endpoint to get the authenticated user's details

export default router ;