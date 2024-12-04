import React, { useState } from 'react'
import '../css/Calendar.css'

const Calendar = ( { selectedDate, setSelectedDate, tasks, setTasks }) => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const dates = generateDatesForMonth(currentDate)

    const renderTasksForDate = (date) => {
        console.log('Rendering tasks for date:', date);
        console.log('Filtered tasks:', tasks.filter(task => task.date === date));
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
          ));
    };
      

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    }

    const handleDrop = (e, date) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('taskId'));
        console.log('Dropping task ID:', taskId, 'to date:', date);
      
        setTasks(tasks.map(task =>
          task.id === taskId
            ? { ...task, date: date }
            : task
        ));
      };
      

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

export default Calendar
