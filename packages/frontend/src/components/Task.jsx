import React, { useState } from 'react';
import TaskAdd from './TaskAdd';
import TaskList from './TaskList';
import '../css/Task.css';

const URL = "http://localhost:8001";

const Task = ({ userId, tasks, setTasks }) => {
    const [filter, setFilter] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);

    const filteredTasks = filter
        ? tasks.filter((task) => task.priority === filter)
        : tasks;

    const filterButtons = [
        { value: 'high', label: 'High Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'low', label: 'Low Priority' },
        { value: null, label: 'Show All' },
    ];

    const handleFilterClick = (priority) => {
        setFilter(priority);
        setActiveFilter(priority);
    };

    const handleAddTask = async (newTask) => {
        try {
            const response = await fetch(`${URL}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newTask, userId }),
            });

            if (!response.ok) {
                throw new Error(`Failed to add task: ${response.status}`);
            }

            const savedTask = await response.json();
            setTasks((prevTasks) => [...prevTasks, savedTask]);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const updateUserPoints = async (points) => {
        try {
            const response = await fetch(`${URL}/users/${userId}/addPoints`, {
                method: 'PUT', // Change from 'POST' to 'PUT'
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ points }),
            });
    
            if (!response.ok) { 
                throw new Error(`Failed to update points: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Points updated successfully:', data);
        } catch (error) {
            console.error('Error updating points:', error);
        }
    };

    const toggleTaskCompletion = async (taskId) => {
        const taskToToggle = tasks.find((task) => task._id === taskId);
    
        if (!taskToToggle) {
            console.error('Task not found for ID:', taskId);
            return;
        }
    
        const updatedTask = { ...taskToToggle, isCompleted: !taskToToggle.isCompleted };
    
        try {
            const response = await fetch(`${URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to update task: ${response.status}`);
            }
    
            const updatedTaskFromServer = await response.json();
    
            // Award points if task is marked as completed
            if (updatedTaskFromServer.isCompleted) {
                const priorityPoints = {
                    low: 10,
                    medium: 20,
                    high: 30,
                };
    
                const pointsToAdd = priorityPoints[updatedTaskFromServer.priority] || 0;
                console.log('Points to add:', pointsToAdd, 'for task:', updatedTaskFromServer);
    
                // Update user points on the backend
                await updateUserPoints(userId, pointsToAdd);
            }
    
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? updatedTaskFromServer : task
                )
            );
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
    
    return (
        <div className="task-container">
            <div className="task-controls">
                <TaskAdd
                    userId={userId}
                    onTaskAdded={(newTask) =>
                        setTasks((prevTasks) => [...prevTasks, newTask])
                    }
                />
                <div className="task-list-container">
                    <TaskList
                        tasks={filteredTasks}
                        toggleTask={toggleTaskCompletion}
                    />
                    <div className="filter-buttons">
                        {filterButtons.map((button) => (
                            <button
                                key={button.label}
                                onClick={() => handleFilterClick(button.value)}
                                className={`filter-button ${
                                    activeFilter === button.value ? 'active' : ''
                                }`}
                            >
                                {button.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Task;
