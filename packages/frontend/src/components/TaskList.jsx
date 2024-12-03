import React from 'react';
import { FetchUpdateTask } from '../httpUltilities.jsx';

const TaskList = ({ tasks, setTasks }) => {
    // Toggle task completion status
    const toggleTask = (taskId) => {
        if (!Array.isArray(tasks)) {
            console.error('Tasks is not an array:', tasks);
            return;
        }

        const taskToUpdate = tasks.find((task) => task._id === taskId);
        if (!taskToUpdate) {
            console.error('Task not found with ID:', taskId);
            return;
        }

        const updatedTask = {
            ...taskToUpdate,
            isCompleted: !taskToUpdate.isCompleted,
        };

        // Optimistic UI update
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
        );

        FetchUpdateTask(taskId, { isCompleted: updatedTask.isCompleted })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update task');
                }
                return response.json();
            })
            .then((savedTask) => {
                // Update task in state with server response (if necessary)
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId ? savedTask : task
                    )
                );
            })
            .catch((error) => {
                console.error('Error updating task:', error);

                // Rollback optimistic update
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId ? taskToUpdate : task
                    )
                );
                alert('Failed to update task. Please try again.');
            });
    };

    // Render the list of tasks
    return (
        <div className="task-list">
            <h2>Tasks</h2>
            <div className="tasks">
                {Array.isArray(tasks) && tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div
                            key={task._id}
                            className={`task-item ${task.priority}`}
                            draggable
                            onDragStart={(e) =>
                                e.dataTransfer.setData('taskId', task._id)
                            }
                        >
                            <input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={() => toggleTask(task._id)}
                            />
                            <span className={task.isCompleted ? 'completed' : ''}>
                                {task.title || 'Untitled Task'} - {task.date || 'No Date'}
                            </span>
                            <span className="priority">
                                {task.priority || 'No Priority'}
                            </span>
                        </div>
                    ))
                ) : (
                    <p>No tasks to display.</p>
                )}
            </div>
        </div>
    );
};

export default TaskList;
