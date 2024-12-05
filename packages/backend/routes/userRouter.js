import express from 'express';
import userServices from '../models/user-services.js';

const router = express.Router();

// Get user statistics
router.get('/:userId/stats', async (req, res) => {
    const userId = req.params.userId;
    try {
        const stats = await userServices.getUserStats(userId);
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
});

// Update user statistics (called when tasks are completed)
router.put('/:userId/stats', async (req, res) => {
    const userId = req.params.userId;
    const updates = req.body;
    try {
        const updatedStats = await userServices.updateUserStats(userId, updates);
        res.status(200).json(updatedStats);
    } catch (error) {
        console.error('Error updating user stats:', error);
        res.status(500).json({ error: 'Failed to update user statistics' });
    }
});

export default router;