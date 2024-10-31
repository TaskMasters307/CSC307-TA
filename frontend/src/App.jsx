// src/App.jsx
import React, { useState } from 'react'
import TaskList from './components/TaskList'
import TaskAdd from './components/TaskAdd'
import Calendar from './components/Calendar'
import Navigation from './components/Navigation'
import Welcome from './components/Welcome'
import Leaderboard from './components/Leaderboard'

import './App.css'

/**
 * Main App Component
 * Manages the application state and renders the main UI
 */
function App() {
    // State management for tasks and UI
    const [tasks, setTasks] = useState([]) // Stores all tasks
    const [currentView, setCurrentView] = useState('welcome') // Controls which view is displayed
    const [selectedDate, setSelectedDate] = useState(new Date()) // Selected date for calendar

    //Adds a new task to the tasks array

    const addTask = (taskText) => {
        if (taskText.trim()) {
            setTasks([
                ...tasks,
                {
                    id: Date.now(),
                    text: taskText,
                    completed: false,
                    date: selectedDate,
                    points: 10, // Default points value
                },
            ])
        }
    }

    /**
     * Toggles the completion status of a task
     */
    const toggleTask = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        )
    }

    return (
        <div className="app">
            <h1>TaskArena</h1>
            <Navigation
                currentView={currentView}
                setCurrentView={setCurrentView}
            />
            <main>
                {currentView === 'welcome' && (
                    <Welcome setCurrentView={setCurrentView} username="User" />
                )}
                {currentView === 'tasks' && (
                    <TaskList
                        tasks={tasks}
                        toggleTask={toggleTask}
                        setCurrentView={setCurrentView}
                    />
                )}
                {currentView === 'add' && (
                    <TaskAdd
                        addTask={addTask}
                        setCurrentView={setCurrentView}
                    />
                )}
                {currentView === 'calendar' && (
                    <Calendar
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                )}
                {currentView === 'leaderboard' && (
                    <Leaderboard />
                )}
            </main>
        </div>
    )
}

export default App
