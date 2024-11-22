import React, { useState } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'
import TaskList from './components/TaskList'
import TaskAdd from './components/TaskAdd'
import Calendar from './components/Calendar'
import Navigation from './components/Navigation'
import Welcome from './components/Welcome'
import Leaderboard from './components/Leaderboard'
import Login from './components/Login'
import Signup from './components/Signup'

import './App.css'

/**
 * Main App Component
 * Manages the application state and renders the main UI
 */
function App() {
    const [tasks, setTasks] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [isLoggedIn, setIsLoggedIn] = useState(false)


    const addTask = (taskText) => {
        if (taskText.trim()) {
            setTasks([
                ...tasks,
                {
                    id: Date.now(),
                    text: taskText,
                    completed: false,
                    date: selectedDate,
                    points: 10,
                },
            ])
        }
    }

    const toggleTask = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        )
    }

    const handleLoginSuccess = () => {
        setIsLoggedIn(true)
    }

    const handleSignup = () => {
        setIsLoggedIn(false)
    }

    return (
        <div className="app">
            <Router>
                {isLoggedIn ? (
                    <div>
                        <h1>TaskArena</h1>
                        <Navigation />
                        <main>
                            <Routes>
                                <Route
                                    path="/"
                                    element={<Navigate to="/welcome" />}
                                />
                                <Route
                                    path="/welcome"
                                    element={<Welcome username={username} />}
                                />
                                <Route
                                    path="/tasks"
                                    element={
                                        <TaskList
                                            tasks={tasks}
                                            toggleTask={toggleTask}
                                        />
                                    }
                                />
                                <Route
                                    path="/add"
                                    element={<TaskAdd addTask={addTask} />}
                                />
                                <Route
                                    path="/calendar"
                                    element={
                                        <Calendar
                                            selectedDate={selectedDate}
                                            setSelectedDate={setSelectedDate}
                                        />
                                    }
                                />
                                <Route
                                    path="/leaderboard"
                                    element={<Leaderboard />}
                                />
                            </Routes>
                        </main>
                    </div>
                ) : (
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <Login onLoginSuccess={handleLoginSuccess} />
                            }
                        />
                        <Route
                            path="/signup"
                            element={<Signup onSignup={handleSignup} />}
                        />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                )}
            </Router>
        </div>
    )
}

export default App
