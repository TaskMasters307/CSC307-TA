import React, { useState, useEffect } from 'react'
import TaskAdd from './TaskAdd'
import TaskList from './TaskList'
import './Calendar.css'

const Calendar = () => {
    const [tasks, setTasks] = useState([])
    const [filter, setFilter] = useState(null)
    const [currentDate, setCurrentDate] = useState(new Date())
    const dates = generateDatesForMonth(currentDate)

    useEffect(() => {
        const initialTasks = [
            {
                id: 1,
                title: 'Task 1',
                date: '2024-11-08',
                priority: 'high',
                isCompleted: false,
            },
            {
                id: 2,
                title: 'Task 2',
                date: '2024-11-09',
                priority: 'medium',
                isCompleted: false,
            },
        ]
        setTasks(initialTasks)
    }, [])

    const addTask = (newTask) => setTasks([...tasks, newTask])

    const toggleTaskCompletion = (taskId) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId
                    ? { ...task, isCompleted: !task.isCompleted }
                    : task
            )
        )
    }

    const filterTasks = (priority) => setFilter(priority)

    const filteredTasks = filter
        ? tasks.filter((task) => task.priority === filter)
        : tasks

    const renderTasksForDate = (date) => {
        return filteredTasks
            .filter((task) => task.date === date)
            .map((task) => (
                <div
                    key={task.id}
                    className={`task ${task.priority}`}
                    draggable
                    onDragStart={(e) =>
                        e.dataTransfer.setData('taskId', task.id)
                    }
                >
                    <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleTaskCompletion(task.id)}
                    />
                    <span>{task.title}</span>
                </div>
            ))
    }

    const onDrop = (event, date) => {
        const taskId = event.dataTransfer.getData('taskId')
        setTasks(
            tasks.map((task) =>
                task.id === parseInt(taskId) ? { ...task, date: date } : task
            )
        )
    }

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
                <TaskAdd addTask={addTask} />
                <TaskList
                    tasks={tasks}
                    toggleTask={toggleTaskCompletion}
                    setCurrentView={() => {}}
                />
            </div>
            <div className="filter-buttons">
                <button onClick={() => filterTasks('high')}>
                    High Priority
                </button>
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
    )
}

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
