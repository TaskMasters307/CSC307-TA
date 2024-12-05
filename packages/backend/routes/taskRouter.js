import express from 'express';
import taskServices from '../models/task-services.js';

const router = express.Router();

// Get tasks for a user
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const tasks = await taskServices.getTasksByUser(userId);
        res.status(200).send(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Error fetching tasks');
    }
});

// Create a new task
router.post('/', async (req, res) => {
    const { title, date, priority, userId } = req.body;

    if (!title || !date || !userId) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const task = await taskServices.addTask({ title, date, priority, userId });
        res.status(201).send(task);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).send('Error adding task');
    }
});

// Update a task
router.put('/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const updatedData = req.body;

    try {
        const updatedTask = await taskServices.findByIdAndUpdate(taskId, updatedData);
        if (!updatedTask) {
            return res.status(404).send({ error: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send({ error: 'Failed to update task' });
    }
});

// Delete a task
router.delete('/:taskId', async (req, res) => {
    const { taskId } = req.params;
    try {
        const deletedTask = await taskServices.deleteTask(taskId);
        if (!deletedTask) {
            return res.status(404).send({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send({ error: 'Failed to delete task' });
    }
});

export default router;