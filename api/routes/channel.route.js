import express from "express";
import { createChannel, deleteChannel, getChannel, getPublicChannels, getUserChannels, joinChannel, leaveChannel, updateChannel } from "../controllers/channel.controller.js";
import { getUserIdFromToken, verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/public', getPublicChannels);

router.get('/user', getUserIdFromToken, getUserChannels);

router.get('/:id', getUserIdFromToken, getChannel);

router.post('/join', getUserIdFromToken, joinChannel);

router.post('/leave', getUserIdFromToken, leaveChannel);

router.post('/', verifyToken("admin"),createChannel);

router.put('/:id', verifyToken("admin"), updateChannel) //add new members to channel

router.delete('/:id', verifyToken("admin"), deleteChannel);

export default router;