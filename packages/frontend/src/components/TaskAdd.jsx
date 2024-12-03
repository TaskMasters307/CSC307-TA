import React, { useState } from 'react';
import {FetchAddTask} from '../httpUltilities.jsx';

const TaskAdd = ({ addTask, userId }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [priority, setPriority] = useState('low');
    const [error, setError] = useState('');

    const handleAddTask = () => {
        if (title && date) {
            const newTask = {
                title,
                date,
                priority,
                isCompleted: false,
                userId, 
            };
    
            FetchAddTask(newTask)
                .then((savedTask) => {
                    addTask(savedTask);
                    setTitle('');
                    setDate('');
                    setPriority('low');
                    setError('');
                })
                .catch((error) => {
                    console.error('Error adding task:', error);
                    setError('Failed to add task. Please try again.');
                });
        } else {
            setError('Title and date are required.');
        }
    };
    
    return (
        <div className="task-add">
            <h2>Add New Task</h2>
            {error && <p className="error">{error}</p>}
            <div className="add-form">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task description"
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <div className="button-group">
                    <button onClick={handleAddTask}>Add Task</button>
                </div>
            </div>
        </div>
    );
};

export default TaskAdd;
