

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import Task from './components/Task';
import Settings from './components/Settings';
import Signup from './components/Signup';
import Calendar from './components/Calendar';

const URL = "https://backend-task-arena-bhaxftapffehhhcj.westus3-01.azurewebsites.net";
//const URL = "http://localhost:8001"
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Function to fetch tasks for the logged-in user
    const fetchUserTasks = async (userId) => {
        try {
            const response = await fetch(`${URL}/tasks/${userId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch tasks: ${response.status}`);
            }
            const data = await response.json();
            setTasks(data || []); 
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Handle login success
    const handleLoginSuccess = (id) => {
        console.log('Setting userId:', id);
        setIsLoggedIn(true);
        setUserId(id);
        setUsername(username); // Assuming you want to set username as well
        fetchUserTasks(id);
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    // Handle logout
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserId(null);
        setTasks([]);
    };

    return (
        <Router>
            <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
                {isLoggedIn ? (
                    <>
                        <h1>TaskArena</h1>
                        <Navigation />
                        <Routes>
                            <Route 
                                path="/welcome" 
                                element={<Welcome username={username} />} 
                            />
                            <Route 
                                path="/tasks" 
                                element={<Task userId={userId} tasks={tasks} setTasks={setTasks} />} 
                            />
                            <Route 
                                path="/calendar" 
                                element={
                                    <Calendar
                                        selectedDate={selectedDate}
                                        setSelectedDate={setSelectedDate}
                                        tasks={tasks}
                                        setTasks={setTasks}
                                    />
                                } 
                            />
                            <Route path="/leaderboard" element={<Leaderboard />} />
                            <Route 
                                path="/settings" 
                                element={
                                    <Settings
                                        onLogout={handleLogout}
                                        toggleDarkMode={toggleDarkMode}
                                        isDarkMode={isDarkMode}
                                    />
                                } 
                            />
                            <Route path="*" element={<Navigate to="/welcome" replace />} />
                        </Routes>
                    </>
                ) : (
                    <Routes>
                        <Route 
                            path="/login" 
                            element={
                                <Login
                                    onLoginSuccess={handleLoginSuccess}
                                />
                            } 
                        />
                        <Route 
                            path="/signup" 
                            element={
                                <Signup
                                    LoginSuccess={handleLoginSuccess}
                                />
                            } 
                        />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                )}
            </div>
        </Router>
    );
}

export default App;