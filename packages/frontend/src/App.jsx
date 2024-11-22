import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskAdd from './components/TaskAdd';
import Calendar from './components/Calendar';
import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import Signup from './components/Signup';

import './App.css';

/**
 * Main App Component
 * Manages the application state and renders the main UI
 */
function App() {
    const [tasks, setTasks] = useState([]); // Stores all tasks
    const [currentView, setCurrentView] = useState('login'); // Controls which view is displayed
    const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date for calendar
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks login state
    const [username, setUsername] = useState(''); // Stores the logged-in username

    // Adds a new task
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
            ]);
        }
    };

    // Toggles task completion
    const toggleTask = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    // Handles successful login
    const handleLoginSuccess = (username) => {
        setIsLoggedIn(true);
        setUsername(username);
        setCurrentView('welcome');
    };

    // Handles successful signup
    const handleSignupSuccess = (username) => {
        setIsLoggedIn(true);
        setUsername(username);
        setCurrentView('welcome');
    };

    // Logs the user out
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setCurrentView('login');
    };

    // Switches to signup view
    const handleSignupView = () => {
        setCurrentView('signup');
    };

    return (
        <div className="app">
            {isLoggedIn ? (
                // Main app content after login
                <div>
                    <h1>TaskArena</h1>
                    <Navigation
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        onLogout={handleLogout}
                    />
                    <main>
                        {currentView === 'welcome' && (
                            <Welcome
                                setCurrentView={setCurrentView}
                                username={username}
                            />
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
                        {currentView === 'leaderboard' && <Leaderboard />}
                    </main>
                </div>
            ) : (
                // Login/Signup forms
                <>
                    {currentView === 'login' ? (
                        <Login
                            onLoginSuccess={handleLoginSuccess}
                            onSignup={handleSignupView}
                        />
                    ) : currentView === 'signup' ? (
                        <Signup
                            onSignupSuccess={handleSignupSuccess}
                            onCancel={() => setCurrentView('login')}
                        />
                    ) : null}
                </>
            )}
        </div>
    );
}

export default App;
