import React, { useState } from 'react';
import Calendar from './components/Calendar';
import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import Task from './components/Task';
import Settings from './components/Settings';
//const URL = "https://backend-task-arena-bhaxftapffehhhcj.westus3-01.azurewebsites.net"
const URL = "http://localhost:8001"


import './App.css';
import Signup from './components/Signup';

function App() {
    const [currentView, setCurrentView] = useState('signup'); // Controls which view is displayed
    const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date for the calendar
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [tasks, setTasks] = useState([]); // Centralized tasks state

    // Function to fetch tasks for the logged-in user
    const fetchUserTasks = async (userId) => {
        try {
            const response = await fetch(`${URL}/tasks/${userId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch tasks: ${response.status}`);
            }
            const data = await response.json();
            setTasks(data || []); // Set fetched tasks
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Handle login success
    const handleLoginSuccess = (id) => {
        console.log('Setting userId:', id);
        setIsLoggedIn(true);
        setUserId(id); // Save the userId for task association
        setCurrentView('welcome'); // Switch to main content on successful login
        fetchUserTasks(id); // Fetch tasks immediately after login
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    // Handle logout
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserId(null);
        setTasks([]); // Clear tasks on logout
        setCurrentView('login');
    };

    // Switch back to signup
    const handleSignup = () => {
        setCurrentView('signup');
    };

    return (
        <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
            {isLoggedIn ? (
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
                            />
                        )}
                        {currentView === 'tasks' && (
                            <Task userId={userId} tasks={tasks} setTasks={setTasks} />
                        )}
                        {currentView === 'calendar' && (
                            <Calendar
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                tasks={tasks}
                                setTasks={setTasks}
                            />
                        )}
                        {currentView === 'leaderboard' && <Leaderboard />}
                        {currentView === 'settings' && (
                            <Settings
                                onLogout={handleLogout}
                                toggleDarkMode={toggleDarkMode}
                                isDarkMode={isDarkMode}
                            />
                        )}
                    </main>
                </div>
            ) : (
                <>
                    {currentView === 'login' ? (
                        <Login
                            onLoginSuccess={handleLoginSuccess}
                            PopSignup={handleSignup}
                        />
                    ) : currentView === 'signup' ? (
                        <Signup
                            LoginSuccess={handleLoginSuccess}
                            closeForm={() => setCurrentView('login')}
                        />
                    ) : null}
                </>
            )}
        </div>
    );
}

export default App;
