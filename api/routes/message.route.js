import express from "express";
import { getUserIdFromToken } from "../middleware/verifyToken.js";
import { addMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get('/:id', getUserIdFromToken, getMessages);

router.post('/:id', getUserIdFromToken, addMessage);

export default router;