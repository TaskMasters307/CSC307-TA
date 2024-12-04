import React, { useState } from 'react';
import Calendar from './components/Calendar';
import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import Task from './components/Task';
import Settings from './components/Settings';

import './App.css';
import Signup from './components/Signup';

function App() {
    // State for overall app management
    const [currentView, setCurrentView] = useState('signup'); // Controls which view is displayed
    const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date for the calendar
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Handle login success
    const handleLoginSuccess = (id) => {
        console.log('Setting userId:', id);
        setIsLoggedIn(true);
        setUserId(id); // Save the userId for task association
        setCurrentView('welcome'); // Switch to main content on successful login
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    // Handle logout
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserId(null);
        setCurrentView('login');
    };

    // Switch back to signup
    const handleSignup = () => {
        setCurrentView('signup');
    };

    return (
        <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
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
                            />
                        )}
                        {currentView === 'tasks' && (
                            <Task userId={userId} />
                        )}
                        {currentView === 'calendar' && (
                            <Calendar
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
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
                // Login/Signup forms
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
