import React, { useState, useEffect } from 'react'
//import { AddUserTask } from './httpUltilities.jsx'
import '../css/Task.css'
/**
 * TaskAdd Component
 * Form for adding new tasks with date and priority
 */
const TaskAdd = ({ addTask, userId }) => {
    // State for task fields
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [priority, setPriority] = useState('low')
    //const [error, setError] = useState('')
    console.log('TaskAdd received userId:', userId);

    useEffect(() => {
        if (!userId) {
            console.error('TaskAdd: userId is null or undefined');
        } else {
            console.log('TaskAdd received valid userId:', userId);
        }
    }, [userId]);
    
    const handleAddTask = () => {
        if (title && date && userId) {
            const newTask = { title, date, priority, userId };
    
            fetch('http://localhost:8001/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask),
            })
                .then((response) => {
                    if (!response.ok) throw new Error('Failed to add task');
                    return response.json();
                })
                .then((task) => {
                    console.log('Task added successfully:', task);
                    addTask(task); // Update parent state
                    setTitle('');
                    setDate('');
                    setPriority('low');
                })
                .catch((error) => console.error('Error adding task:', error));
        } else {
            console.error('Missing fields: title, date, or userId');
        }
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
