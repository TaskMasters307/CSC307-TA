import React, { useState, useEffect } from 'react'
//import { AddUserTask } from './httpUltilities.jsx'
import '../css/Task.css'
const URL = "https://backend-task-arena-bhaxftapffehhhcj.westus3-01.azurewebsites.net"
//const URL = "http://localhost:8001"
/**
 * TaskAdd Component
 * Form for adding new tasks with date and priority
 */
const TaskAdd = ({ userId, onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [priority, setPriority] = useState('low');

    const handleAddTask = () => {
        // Validate input fields
        if (!title || !date || !userId) {
            console.error('Missing fields: title, date, or userId');
            return;
        }
    
        // Create the task object
        const newTask = { title, date, priority, userId };
    
        // Debugging: Log the task to ensure it's correct
        console.log('Adding task:', newTask);
    
        fetch(`${URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask), // Ensure newTask is a plain object
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to add task: ${response.status}`);
                }
                return response.json();
            })
            .then((task) => {
                console.log('Task added successfully:', task);
                onTaskAdded(task); // Add the task to the parent state
                setTitle('');
                setDate('');
                setPriority('low');
            })
            .catch((error) => console.error('Error adding task:', error));
    };
    


    return (
        <div className="task-add">
            <h2>Add New Task</h2>
            <div className="add-form">
                {/* Task Title Input */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task description"
                />

                {/* Task Date Input */}
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                {/* Task Priority Dropdown */}
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>

                {/* Buttons */}
                <div className="button-group">
                    <button onClick={handleAddTask}>Add Task</button>
                </div>
            </div>
        </div>
    )
}

export default TaskAdd
