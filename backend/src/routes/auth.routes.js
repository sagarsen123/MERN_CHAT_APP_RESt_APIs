import { Router } from "express";
import { signUp, logIn, logOut, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRoutes = Router();

authRoutes.post('/signup', signUp)
authRoutes.post('/login', logIn)
authRoutes.post('/logout', logOut)
authRoutes.put("/update-profile", protectRoute, updateProfile)
authRoutes.get('/check', protectRoute,checkAuth)
export default authRoutes