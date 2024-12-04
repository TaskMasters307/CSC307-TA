import React, { useState, useEffect } from 'react';
import TaskAdd from './TaskAdd';
import TaskList from './TaskList';
import '../css/Task.css';

const Task = ({ userId }) => {
    const [tasks, setTasks] = useState([]); // Manage tasks locally
    const [filter, setFilter] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);

    // Fetch tasks when userId changes
    useEffect(() => {
        if (userId) {
            console.log(`Fetching tasks for userId: ${userId}`);
            fetch(`http://localhost:8001/tasks/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch tasks: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('Fetched tasks:', data);
                    setTasks(data || []); // Set empty array if no tasks are returned
                })
                .catch((error) => console.error('Error fetching tasks:', error));
        }
    }, [userId]);

    // Add a new task to the local state
    const handleAddTask = (newTask) => {
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    // Toggle task completion
    const toggleTaskCompletion = async (taskId) => {
        const taskToToggle = tasks.find((task) => task._id === taskId);

        if (taskToToggle) {
            const updatedTask = {
                ...taskToToggle,
                isCompleted: !taskToToggle.isCompleted,
            };

            try {
                const response = await fetch(`http://localhost:8001/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedTask),
                });

                if (!response.ok) {
                    throw new Error(`Failed to update task: ${response.status}`);
                }

                const updatedTaskFromServer = await response.json();
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId ? updatedTaskFromServer : task
                    )
                );
            } catch (error) {
                console.error('Error updating task:', error);
            }
        }
    };

    // Filter tasks based on priority
    const filteredTasks = filter
        ? tasks.filter((task) => task.priority === filter)
        : tasks;

    // Filter button data
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

    return (
        <div className="task-container">
            <div className="task-controls">
                <TaskAdd userId={userId} onTaskAdded={handleAddTask} />
                <div className="task-list-container">
                    <TaskList tasks={filteredTasks} toggleTask={toggleTaskCompletion} />
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
