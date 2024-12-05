import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import Task from './components/Task';
import Settings from './components/Settings';
import deployment from './components/env.jsx';
import TeamPage from './components/TeamPage.jsx'
const API_URL = deployment 
    ? "https://backend-task-arena-bhaxftapffehhhcj.westus3-01.azurewebsites.net"
    : "http://localhost:8001";  

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
            const response = await fetch(`${API_URL}/api/tasks/${userId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch tasks: ${response.status}`);
            }
            const data = await response.json();
            setTasks(data || []); // Replace state with fetched tasks
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
        setTasks([]); 
        setCurrentView('login');
    };

    // Switch back to signup
    const handleSignup = () => {
        setCurrentView('signup');
    };

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

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
                            <div className="welcome-container">
                                <Welcome
                                username={username}
                                userId={userId}
                            />
                            </div>
                        )}
                        {currentView === 'tasks' && (
                            <div className="task-container">
                            <Task userId={userId} tasks={tasks} setTasks={setTasks} />
                            </div>
                        )}
                        {currentView === 'calendar' && (
                            <div className="calendar-container">
                            <Calendar
                              selectedDate={selectedDate}
                              setSelectedDate={setSelectedDate}
                              tasks={tasks}
                              setTasks={setTasks}
                            />
                            </div>
                        )}
                        {currentView === 'leaderboard' && (
                        <div className="leaderboard-container">
                        <Leaderboard 
                        />
                      </div>
                      )}
                        {currentView === 'team' && (
                            <div className="team-container">
                                <TeamPage />
                            </div>
                        )}
                        {currentView === 'settings' && (
                            <div className="settings-container">
                            <Settings
                                onLogout={handleLogout}
                                toggleDarkMode={toggleDarkMode}
                                isDarkMode={isDarkMode}
                            />
                            </div>
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
