import React from 'react';
import TaskAdd from './TaskAdd';
import TaskList from './TaskList';
import '../css/Task.css';
const URL = "https://backend-task-arena-bhaxftapffehhhcj.westus3-01.azurewebsites.net"
//const URL = "http://localhost:8001"

const Task = ({ userId, tasks, setTasks }) => {
    const handleAddTask = async (newTask) => {
        try {
            const response = await fetch(`${URL}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newTask, userId }),
            });

            if (!response.ok) {
                throw new Error(`Failed to add task: ${response.status}`);
            }

            const savedTask = await response.json();
            setTasks((prevTasks) => [...prevTasks, savedTask]);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const toggleTaskCompletion = async (taskId) => {
        const taskToToggle = tasks.find((task) => task._id === taskId);

        if (taskToToggle) {
            const updatedTask = { ...taskToToggle, isCompleted: !taskToToggle.isCompleted };

            try {
                const response = await fetch(`${URL}/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedTask),
                });

                if (!response.ok) {
                    throw new Error(`Failed to update task: ${response.status}`);
                }

                const updatedTaskFromServer = await response.json();
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId ? updatedTaskFromServer : task
                    )
                );
            } catch (error) {
                console.error('Error updating task:', error);
            }
        }
    };

    return (
        <div className="task-container">
            <TaskAdd userId={userId} onTaskAdded={(newTask) => setTasks((prevTasks) => [...prevTasks, newTask])} />
            <TaskList tasks={tasks} toggleTask={toggleTaskCompletion} />
        </div>
    );
};

export default Task;
