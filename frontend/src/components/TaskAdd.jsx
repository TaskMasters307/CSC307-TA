// src/components/TaskAdd.jsx
import React, { useState } from 'react';

/**
 * TaskAdd Component
 * Form for adding new tasks
 */
const TaskAdd = ({ addTask, setCurrentView }) => {
  // Local state for the task input field
  const [localTask, setLocalTask] = useState('');

  const handleInputChange = (e) => {
    setLocalTask(e.target.value);
  };

  const handleAddTask = () => {
    addTask(localTask);
    setCurrentView('tasks');
  };

  return (
    <div className="task-add">
      <h2>Add New Task</h2>
      <div className="add-form">
        <input
          type="text"
          value={localTask}
          onChange={handleInputChange}
          placeholder="Enter task description"
        />
        <div className="button-group">
          <button onClick={() => setCurrentView('tasks')}>Cancel</button>
          <button onClick={handleAddTask}>Add Task</button>
        </div>
      </div>
    </div>
  );
};

export default TaskAdd;