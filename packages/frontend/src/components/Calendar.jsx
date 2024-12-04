import React, { useState } from 'react'
import '../css/Calendar.css'

const Calendar = ( { selectedDate, setSelectedDate, tasks, setTasks }) => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const dates = generateDatesForMonth(currentDate)

    const renderTasksForDate = (date) => {
        return tasks
            .filter(task => task.date === date)
            .map(task => (
                <div
                    key={task.id}
                    className={`calendar-task ${task.priority} ${task.isCompleted ? 'completed' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                >
                    <span>{task.title}</span>
                </div>
            ))
    }

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    }

    const handleDrop = (e, date) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('taskId'));
        
        // Update the task's date
        setTasks(tasks.map(task => 
            task.id === taskId 
                ? { ...task, date: date }
                : task
        ));
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate)
        newDate.setMonth(currentDate.getMonth() + offset)
        setCurrentDate(newDate)
    }

    return (
        <div className="calendar-container">
            <h1>Task Calendar</h1>
            <div className="month-navigation">
                <span onClick={() => changeMonth(-1)} className="arrow">◀</span>
                <span>
                    {currentDate.toLocaleString('default', { month: 'long' })}{' '}
                    {currentDate.getFullYear()}
                </span>
                <span onClick={() => changeMonth(1)} className="arrow">▶</span>
            </div>
            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="day-label">
                        {day}
                    </div>
                ))}
                {dates.map((date) => (
                    <div
                        key={date || Math.random()} // use random key for null dates
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
    )
}

const generateDatesForMonth = (currentDate) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    // Log the first day of the month
    const firstOfMonth = new Date(year, month, 1)
    console.log("First of month:", firstOfMonth)
    console.log("Day of week for first:", firstOfMonth.getDay())
    const firstDay = new Date(year, month, 1).getDay()
    const dates = []
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    console.log("Days in month:", daysInMonth)
    // Add empty slots for days before the first of the month
    if (firstDay > 0) {  // Only add empty slots if first day isn't Sunday
        for (let i = 0; i < firstDay; i++) {
            dates.push(null)
        }
    }
    console.log("First day:", firstDay)
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(Date.UTC(year, month, day))
        dates.push(date.toISOString().split('T')[0])
    }
    console.log("Generated dates:", dates)
    return dates
}

export default Calendar
