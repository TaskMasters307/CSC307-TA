import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskAdd from './components/TaskAdd';
import Calendar from './components/Calendar';
import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import Signup from './components/Signup';

import { FetchTasks, FetchAddTask, FetchUpdateTask } from './httpUltilities';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [currentView, setCurrentView] = useState('login');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);

    const addTask = async (taskText) => {
        if (taskText.trim()) {
            const newTask = {
                title: taskText,
                date: selectedDate.toISOString().split('T')[0],
                priority: 'low',
                userId, // Use userId for backend task association
            };

            try {
                const savedTask = await FetchAddTask(newTask);
                setTasks([...tasks, savedTask]);
            } catch (error) {
                console.error('Failed to save task:', error);
            }
        }
    };

    const toggleTask = async (taskId) => {
        const taskToUpdate = tasks.find((task) => task._id === taskId);
        if (!taskToUpdate) return;

        const updatedTask = {
            ...taskToUpdate,
            isCompleted: !taskToUpdate.isCompleted,
        };

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? updatedTask : task
            )
        );

        try {
            await FetchUpdateTask(taskId, { isCompleted: updatedTask.isCompleted });
        } catch (error) {
            console.error('Failed to update task:', error);
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? taskToUpdate : task
                )
            );
        }
    };

    const loginUser = async (credentials) => {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const user = await response.json();
            handleLoginSuccess(user);
        } catch (error) {
            console.error('Login error:', error.message);
            alert(error.message || 'Failed to log in. Please try again.');
        }
    };

    const handleLoginSuccess = async (user) => {
        setIsLoggedIn(true);
        setUsername(user.username);
        setUserId(user._id);

        try {
            const userTasks = await FetchTasks(user._id);
            setTasks(Array.isArray(userTasks) ? userTasks : []);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            setTasks([]);
        }

        setCurrentView('welcome');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setTasks([]);
        setCurrentView('login');
    };

    const handleSignup = () => setCurrentView('signup');

    return (
        <div className="app">
            {isLoggedIn ? (
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
                                userId={userId}
                            />
                        )}
                        {currentView === 'calendar' && (
                            <Calendar
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                userId={userId}
                                tasks={tasks}
                                setTasks={setTasks}
                                toggleTask={toggleTask}
                            />
                        )}
                        {currentView === 'leaderboard' && <Leaderboard />}
                    </main>
                </div>
            ) : (
                <>
                    {currentView === 'login' ? (
                        <Login
                            onLoginSuccess={handleLoginSuccess}
                            loginUser={loginUser}
                            PopSignup={handleSignup}
                        />
                    ) : currentView === 'signup' ? (
                        <Signup
                            LoginSuccess={handleLoginSuccess}
                            closeForm={handleLogout}
                        />
                    ) : null}
                </>
            )}
        </div>
    );
}

export default App;
