import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserForSidebar, getMessagesForChat, sendMessageToUser } from "../controllers/message.controller.js";


const messageRoutes = Router()

messageRoutes.get("/users", protectRoute, getUserForSidebar)
messageRoutes.get("/:id", protectRoute, getMessagesForChat)
messageRoutes.post("/send/:id", protectRoute, sendMessageToUser)

export default messageRoutes