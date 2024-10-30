// frontend/src/App.jsx
import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [currentView, setCurrentView] = useState('tasks'); // tasks, calendar, add
  const [selectedDate, setSelectedDate] = useState(new Date());

  const addTask = (task) => {
    if (task.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: task,
        completed: false,
        date: selectedDate,
        points: 10
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const TaskList = () => (
    <div className="task-list">
      <h2>Current Tasks</h2>
      <button onClick={() => setCurrentView('add')} className="add-button">
        + Add Task
      </button>
      <div className="tasks">
        {tasks.map(task => (
          <div key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span className={task.completed ? 'completed' : ''}>
              {task.text}
            </span>
            <span className="points">{task.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );

  const TaskAdd = () => (
    <div className="task-add">
      <h2>Add New Task</h2>
      <div className="add-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task description"
        />
        <div className="button-group">
          <button onClick={() => setCurrentView('tasks')}>Cancel</button>
          <button
            onClick={() => {
              addTask(newTask);
              setCurrentView('tasks');
            }}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );

  const CalendarView = () => {
    const daysInMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    ).getDate();
    
    const startDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    ).getDay();

    return (
      <div className="calendar">
        <h2>Calendar</h2>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-header">
              {day}
            </div>
          ))}
          {[...Array(startDay)].map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}
          {[...Array(daysInMonth)].map((_, i) => (
            <div
              key={i + 1}
              className="calendar-day"
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1))}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <h1>TaskArena</h1>
      <nav className="navigation">
        <button
          className={currentView === 'tasks' ? 'active' : ''}
          onClick={() => setCurrentView('tasks')}
        >
          Tasks
        </button>
        <button
          className={currentView === 'calendar' ? 'active' : ''}
          onClick={() => setCurrentView('calendar')}
        >
          Calendar
        </button>
      </nav>
      <main>
        {currentView === 'tasks' && <TaskList />}
        {currentView === 'add' && <TaskAdd />}
        {currentView === 'calendar' && <CalendarView />}
      </main>
    </div>
  );
}

export default App;