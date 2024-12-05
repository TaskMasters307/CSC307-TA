import React, { useState } from 'react';
import '../css/Calendar.css';
import deployment from './env.jsx';
const API_URL = deployment 
    ? "https://backend-task-arena-bhaxftapffehhhcj.westus3-01.azurewebsites.net"
    : "http://localhost:8001";

const Calendar = ({ selectedDate, setSelectedDate, tasks, setTasks }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const dates = generateDatesForMonth(currentDate);

    // Renders tasks for a specific date
    const renderTasksForDate = (date) => {
        return tasks
            .filter((task) => task.date === date)
            .map((task) => (
                <div
                    key={task._id}
                    className={`calendar-task ${task.priority} ${task.isCompleted ? 'completed' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                >
                    <span>{task.title}</span>
                </div>
            ));
    };
//hecl
    // Handles drag start for tasks
    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    // Handles drop event to update the task's date
    const handleDrop = async (e, date) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const taskToUpdate = tasks.find(task => task._id === taskId);

        if (!taskToUpdate)
            return;
        try{
            const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...taskToUpdate,
                    date: date
                })
        });
        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        const updatedTask = await response.json();
        
        setTasks(tasks.map(task => 
            task._id === taskId 
                ? { ...task, date: date }
                : task
        ));
        } catch (error) {
            console.error('Error updating task date:', error);
            // Optionally add user feedback here
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Changes the current month being viewed
    const changeMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    return (
        <div className="calendar-container">
            <h1>Task Calendar</h1>
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
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="day-label">
                        {day}
                    </div>
                ))}
                {dates.map((date, index) => (
                    <div
                        key={index}
                        className={`calendar-day ${!date ? 'empty' : ''}`}
                        onDrop={(e) => date && handleDrop(e, date)}
                        onDragOver={handleDragOver}
                    >
                        {date && (
                            <>
                                <h2>{new Date(date).getDate()}</h2>
                                <div className="day-tasks">
                                    {renderTasksForDate(date)}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helper function to generate all dates for the current month
const generateDatesForMonth = (currentDate) => {
    // Get first day of current month
    const firstOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );
    
    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfWeek = firstOfMonth.getDay();
    const dates = [];

    // Add empty slots for previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
        dates.push(null);
    }

    // Add dates for current month starting from 0 to offset the visual shift
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day + 1
        ).toISOString().split('T')[0];
        dates.push(date);
    }

    return dates;
}

export default Calendar;
