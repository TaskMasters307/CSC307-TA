import React from 'react';
import '../css/Task.css';

const TaskList = ({ tasks, toggleTask }) => (
    <div className="task-add">
        <h2>Tasks</h2>
        <div className="tasks">
            {tasks.map((task) => (
                <div
                    key={task._id} // Use the MongoDB `_id` for a unique key
                    className={`task-item ${task.priority}`}
                    draggable
                    onDragStart={(e) =>
                        e.dataTransfer.setData('taskId', task._id) // Use `_id` for drag data
                    }
                >
                    <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleTask(task._id)} // Use `_id` to toggle tasks
                    />
                    <span className={task.isCompleted ? 'completed' : ''}>
                        {task.title} - {task.date}
                    </span>
                    <span className="priority">{task.priority}</span>
                </div>
            ))}
        </div>
    </div>
);

export default TaskList;
