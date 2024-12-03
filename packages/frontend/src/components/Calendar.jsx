import React, { useState, useEffect } from 'react'
import TaskAdd from './TaskAdd'
import TaskList from './TaskList'
import {FetchAddTask, FetchTasks, } from '../httpUltilities.jsx';
import './Calendar.css'

const Calendar = ({ userId, tasks, setTasks, toggleTask, selectedDate }) => {
    const [filter, setFilter] = useState(null)
    const [currentDate, setCurrentDate] = useState(new Date())
    const dates = generateDatesForMonth(currentDate)
    

    useEffect(() => {
        const fetchTasks = () => {
            FetchTasks(userId)
                .then((data) => setTasks(data))
                .catch((error) => console.error('Error fetching tasks:', error));
        };
        if (userId) fetchTasks();
    }, [userId]);


    const addTask = async (taskText) => {
        const newTask = {
            title: taskText,
            date: selectedDate.toISOString().split('T')[0],
            priority: 'low',
            userId, // Ensure this is populated correctly
        };
    
        console.log('Adding Task:', newTask); // Log the task object
    
        try {
            await FetchAddTask(newTask);
            const updatedTasks = await FetchTasks(userId);
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Failed to add task:', error.message);
            alert('Failed to add task. Please try again.');
        }
    };



    const toggleTaskCompletion = (taskId) => {
        const taskToUpdate = tasks.find((task) => task._id === taskId);
        if (!taskToUpdate) return;

        const updatedTask = { ...taskToUpdate, isCompleted: !taskToUpdate.isCompleted };
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
        );

        // Roll back in case of an error
        FetchAddTask(updatedTask).catch((error) => {
            console.error('Error updating task:', error);
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? taskToUpdate : task
                )
            );
        });
    };

    const filterTasks = (priority) => setFilter(priority);

    const filteredTasks = filter
        ? tasks.filter((task) => task.priority === filter)
        : tasks;


    const renderTasksForDate = (date) => {
        if (!Array.isArray(tasks)) return null;

        return tasks
            .filter((task) => task.date === date)
            .map((task) => (
                <div key={task._id} className={`task ${task.priority}`}>
                    <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleTask(task._id)} // Use the toggleTask prop
                    />
                    <span>{task.title}</span>
                </div>
            ));
    };
        
        

    const onDrop = (event, date) => {
        const taskId = event.dataTransfer.getData('taskId');
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? { ...task, date } : task
            )
        );
    };

    const onDragOver = (event) => event.preventDefault()

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate)
        newDate.setMonth(currentDate.getMonth() + offset)
        setCurrentDate(newDate)
    }


    return (
        <div className="calendar-container">
            <h1>Task Calendar</h1>
            <div className="task-controls">
                <TaskAdd addTask={addTask} userId={userId} />
                <TaskList tasks={tasks} setTasks={setTasks} />
            </div>
            <div className="filter-buttons">
                <button onClick={() => filterTasks('high')}>High Priority</button>
                <button onClick={() => filterTasks('medium')}>
                    Medium Priority
                </button>
                <button onClick={() => filterTasks('low')}>Low Priority</button>
                <button onClick={() => filterTasks(null)}>Show All</button>
            </div>
            <div className="month-navigation">
                <span onClick={() => changeMonth(-1)} className="arrow">
                    ◀
                </span>
                <span>
                    {currentDate.toLocaleString('default', { month: 'long' })}{' '}
                    {currentDate.getFullYear()}
                </span>
                <span onClick={() => changeMonth(1)} className="arrow">
                    ▶
                </span>
            </div>
            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day) => (
                        <div key={day} className="day-label">
                            {day}
                        </div>
                    )
                )}
                {dates.map((date) => (
                    <div
                        key={date}
                        className="calendar-day"
                        onDrop={(e) => onDrop(e, date)}
                        onDragOver={onDragOver}
                    >
                        <h2>{new Date(date).getDate()}</h2>
                        {renderTasksForDate(date)}
                    </div>
                ))}
            </div>
        </div>
    );
};

const generateDatesForMonth = (currentDate) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const dates = []
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day).toISOString().split('T')[0]
        dates.push(date)
    }
    return dates
}

export default Calendar
