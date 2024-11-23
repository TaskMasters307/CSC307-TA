// src/App.jsx
import './App.css'
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
    const [username, setUsername] = useState('') // eslint-disable-line no-unused-vars

    //add userStats state
    const [userStats, setUserStats] = useState({
        totalPoints: 0,
        tasksCompleted: 0,
        currentStreak: 0,
        pointMultiplier: 1.0,
        globalRank: 0
    })
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

    const handleLoginSuccess = (username, stats) => {
        setIsLoggedIn(true)
        setUsername(username)
        setUserStats(stats || {
            totalPoints: 0,
            tasksCompleted: 0,
            currentStreak: 0,
            pointMultiplier: 1.0,
            globalRank: 0
        })
        setCurrentView('welcome') // Switch to main content on successful login
    }    
function CloseForm() {
    setIsLoggedIn(false)
    setCurrentView('login')
    // Reset user data
    setUsername('')
    setUserStats({
        totalPoints: 0,
        tasksCompleted: 0,
        currentStreak: 0,
        pointMultiplier: 1.0,
        globalRank: 0
    })
}

function handleSignup() {
    setCurrentView('signup')
}

return (
    <div className="app">
        {isLoggedIn ? (
            // Main app content after login
            <div>
                <h1>TaskArena</h1>
                <Navigation
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    />
                    <main>
                        {currentView === 'welcome' && (
                            <Welcome
                                setCurrentView={setCurrentView}
                                username={username}
                                stats={userStats} //pass user stats
                                onStatsUpdate={setUserStats}
                            />
                        )}
                        {currentView === 'tasks' && (
                            <TaskList
                                tasks={tasks}
                                toggleTask={toggleTask}
                                setCurrentView={setCurrentView}
                                username={username}
                            />
                        )}
                        {currentView === 'add' && (
                            <TaskAdd
                                addTask={addTask}
                                setCurrentView={setCurrentView}
                                username={username}
                            />
                        )}
                        {currentView === 'calendar' && (
                            <Calendar
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                tasks={tasks}
                            />
                        )}
                        {currentView === 'leaderboard' && (
                            <Leaderboard 
                                currentUserStats={userStats}
                                username={username}
                                />
                            )}
                    </main>
                </div>
            ) : (
                // Login/Signup forms
                <>
                    {currentView === 'login' ? (
                        <Login
                            onLoginSuccess={handleLoginSuccess}
                            PopSignup={handleSignup}
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
