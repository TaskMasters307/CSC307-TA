// src/components/Task.jsx
import React, { useState, useEffect } from 'react'
import TaskAdd from './TaskAdd'
import TaskList from './TaskList'
import '../css/Task.css'

const Task = ({ tasks, addTask, toggleTaskCompletion, userId }) => {
    const [filter, setFilter] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [userTasks, setTasks] = useState([]);

    // Fetch tasks when userId changes
    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:8001/tasks?userId=${userId}`, {
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
                    setTasks(data);
                })
                .catch((error) => console.error('Error fetching tasks:', error));
        }
    }, [userId]);

    const filteredTasks = filter
        ? userTasks.filter((task) => task.priority === filter)
        : userTasks;

    const filterButtons = [
        { value: 'high', label: 'High Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'low', label: 'Low Priority' },
        { value: null, label: 'Show All' }
    ];

    const handleFilterClick = (priority) => {
        setFilter(priority);
        setActiveFilter(priority);
    };

    return (
        <div className="task-container">
            <div className="task-controls">
                <TaskAdd addTask={addTask} userId={userId} />
                <div className="task-list-container">
                    <TaskList tasks={filteredTasks} toggleTask={toggleTaskCompletion} />
                    <div className="filter-buttons">
                        {filterButtons.map(button => (
                            <button 
                                key={button.label}
                                onClick={() => handleFilterClick(button.value)}
                                className={`filter-button ${activeFilter === button.value ? 'active' : ''}`}
                            >
                                {button.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Task