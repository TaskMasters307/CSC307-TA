import React, { useState } from 'react'

/**
 * TaskAdd Component
 * Form for adding new tasks with date and priority
 */
const TaskAdd = ({ addTask }) => {
    // State for task fields
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [priority, setPriority] = useState('low')

    const handleAddTask = () => {
        if (title && date) {
            // Create new task with selected date and priority
            const newTask = {
                id: Date.now(),
                title,
                date,
                priority,
                isCompleted: false,
            }
            addTask(newTask)

            // Reset form fields
            setTitle('')
            setDate('')
            setPriority('low')
        }
    }

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
