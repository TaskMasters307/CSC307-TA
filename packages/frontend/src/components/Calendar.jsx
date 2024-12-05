import React, { useState } from 'react';
import '../css/Calendar.css';

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
                    className={`calendar-task ${task.priority} ${
                        task.isCompleted ? 'completed' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                >
                    <span>{task.title}</span>
                </div>
            ));
    };

    // Handles drag start for tasks
    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    // Handles drop event to update the task's date
    const handleDrop = (e, date) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const updatedTasks = tasks.map((task) =>
            task._id === taskId ? { ...task, date } : task
        );
        setTasks(updatedTasks);
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
    
    console.log(currentDate); // Add this line
        
 
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
        dates.push(null);
    }

    // Add actual dates for the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day).toISOString().split('T')[0];
        dates.push(date);
    }

    return dates;
};

export default Calendar;
