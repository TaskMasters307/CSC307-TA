import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Calendar from './components/Calendar';
import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import Task from './components/Task';
import Settings from './components/Settings';
import deployment from './components/env.jsx';
import TeamPage from './components/TeamPage.jsx';
import Signup from './components/Signup';
import './App.css';

const API_URL = deployment 
    ? "https://backend-task-arena-bhaxftapffehhhcj.westus3-01.azurewebsites.net"
    : "http://localhost:8001";

// Protected Route Component
const ProtectedRoute = ({ children, isLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [tasks, setTasks] = useState([]);

    const fetchUserTasks = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/api/tasks/${userId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch tasks: ${response.status}`);
            }
            const data = await response.json();
            setTasks(data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleLoginSuccess = (id) => {
        setIsLoggedIn(true);
        setUserId(id);
        fetchUserTasks(id);
    };

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    const handleLogout = () => {
        setIsDarkMode(false);
        document.body.classList.remove('dark-mode');

        setIsLoggedIn(false);
        setUserId(null);
        setTasks([]);
    };

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    return (
        <BrowserRouter>
            <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
                {isLoggedIn && (
                    <>
                        <h1>TaskArena</h1>
                        <Navigation />
                    </>
                )}
                <main>
                    <Routes>
                        <Route path="/login" element={
                            isLoggedIn ? 
                                <Navigate to="/welcome" replace /> : 
                                <Login onLoginSuccess={handleLoginSuccess} />
                        } />
                        
                        <Route path="/signup" element={
                            isLoggedIn ? 
                                <Navigate to="/welcome" replace /> : 
                                <Signup LoginSuccess={handleLoginSuccess} />
                        } />

                        <Route path="/welcome" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Welcome username={username} userId={userId} />
                            </ProtectedRoute>
                        } />

                        <Route path="/tasks" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Task userId={userId} tasks={tasks} setTasks={setTasks} />
                            </ProtectedRoute>
                        } />

                        <Route path="/calendar" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Calendar
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    tasks={tasks}
                                    setTasks={setTasks}
                                />
                            </ProtectedRoute>
                        } />

                        <Route path="/leaderboard" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Leaderboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/team" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <TeamPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/settings" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Settings
                                    onLogout={handleLogout}
                                    toggleDarkMode={toggleDarkMode}
                                    isDarkMode={isDarkMode}
                                />
                            </ProtectedRoute>
                        } />

                        <Route path="/" element={
                            isLoggedIn ? 
                                <Navigate to="/welcome" replace /> : 
                                <Navigate to="/login" replace />
                        } />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
