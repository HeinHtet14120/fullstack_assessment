import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js'; // Import the middleware

const router = express.Router();

// Protected route example
router.get('/protected-route', verifyToken('guest'), (req, res) => {
    res.status(200).json({ message: "Access granted!", userId: req.userId });
});

export default router;
