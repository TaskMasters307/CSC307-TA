// src/App.jsx
import React, { useState } from 'react'
import TaskList from './components/TaskList'
import TaskAdd from './components/TaskAdd'
import Calendar from './components/Calendar'
import Navigation from './components/Navigation'
import Welcome from './components/Welcome'
import Leaderboard from './components/Leaderboard'
import Login from './components/Login'
import Task from './components/Task'

import './App.css'
import Signup from './components/Signup'
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/**
 * Main App Component
 * Manages the application state and renders the main UI
 */
function App() {
    // State management for tasks and UI
    const [tasks, setTasks] = useState([]) // Stores all tasks
    const addTask = (newTask) => setTasks([...tasks, newTask]);

    const toggleTaskCompletion = (taskId) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId
                    ? { ...task, isCompleted: !task.isCompleted }
                    : task
            )
        )
    }
    const [currentView, setCurrentView] = useState('signup') // Controls which view is displayed
    const [selectedDate, setSelectedDate] = useState(new Date()) // Selected date for calendar

    //Adds a new task to the tasks array
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setCurrentView('welcome'); // Switch to main content on successful login
        return (
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
            {currentView === 'tasks' && <Task />}
            {currentView === 'calendar' && (
                <Calendar
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
            )}
            {currentView === 'leaderboard' && <Leaderboard />}
        </main>
    </div>
        
        )
    };
    function CloseForm() {
        
        setIsLoggedIn(false);
        setCurrentView('login'); // Switch to main content on successful login
    };
    function handleSignup(){
        
        setCurrentView('signup');
        
    }
    return (
        /*
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/TaskArena" element={<Welcome />} />
      </Routes>
    </Router>
    */
    
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
                            />
                        )}
                        {currentView === 'tasks' && (
                            <Task
                                tasks={tasks}
                                setTasks={setTasks}
                                addTask={addTask}
                                toggleTaskCompletion={toggleTaskCompletion}
                                selectedDate={selectedDate}
                                />
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
                            
                    
                        
                    ) : currentView === "signup" ? (
                        <Signup 
                            LoginSuccess={handleLoginSuccess}
                            closeForm={CloseForm}
                        />
                    ) : null}
                </>
            )}
            
        </div> 
    );
}

export default App;
