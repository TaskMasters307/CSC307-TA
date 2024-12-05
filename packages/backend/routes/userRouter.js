import express from 'express';
import userServices from '../models/user-services.js';
import User from './user.js'

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

router.get('/leaderboard', async (req, res) => {
    try {
        // Get all users, sorted by points in descending order
        const users = await User.find({}, 'username statistics')
            .sort({ 'statistics.totalPoints': -1 })
            .limit(10);  // Limit to top 10 users

        const leaderboardData = users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            points: user.statistics?.totalPoints || 0,
            tasksCompleted: user.statistics?.tasksCompleted || 0
        }));

        res.status(200).json(leaderboardData);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
});

export default router;