import React from 'react'

const TaskList = ({ tasks, toggleTask }) => (
    <div className="task-list">
        <h2>Tasks</h2>
        <div className="tasks">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className={`task-item ${task.priority}`}
                    draggable
                    onDragStart={(e) =>
                        e.dataTransfer.setData('taskId', task.id)
                    }
                >
                    <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleTask(task.id)}
                    />
                    <span className={task.isCompleted ? 'completed' : ''}>
                        {task.title} - {task.date}
                    </span>
                    <span className="priority">{task.priority}</span>
                </div>
            ))}
        </div>
    </div>
)

export default TaskList
