// src/components/TaskList.jsx
import React from 'react';

/**
 * TaskList Component
 * Displays a list of tasks with their completion status and points
 */

const TaskList = ({ tasks, toggleTask, setCurrentView }) => (
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

export default TaskList;