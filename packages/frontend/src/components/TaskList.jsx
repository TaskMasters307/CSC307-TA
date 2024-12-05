import React from 'react'
import '../css/Task.css'
const TaskList = ({ tasks, toggleTask, setTasks }) => {
    const formatDisplayDate = (dateString) => {
        const taskDate = new Date(dateString);
        taskDate.setDate(taskDate.getDate() - 1); // Subtract one day to match user input
        return taskDate.toISOString().split('T')[0];
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    return (
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
                        {task.title} - {formatDisplayDate(task.date)}
                    </span>
                    <span className="priority">{task.priority}</span>
                    {task.isCompleted && (
                            <button 
                                onClick={() => deleteTask(task.id)}
                                className="delete-button"
                            >
                                ×
                            </button>
                        )}
                </div>
            ))}
        </div>
    </div>
)
}

export default TaskList;
