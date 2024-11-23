const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8001'
  : 'https://taskarena-hxd7fcczhcdgfnch.westus3-01.azurewebsites.net';

async function FetchPostUser(account) {
    try {
        const response = await fetch(`${API_URL}/adduser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(account)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create account');
        }
        
        return response;
    } catch (error) {
        console.error('Error in FetchPostUser:', error);
        throw error;
    }
}

function FetchFindUserName(username) {
    const promise = fetch(
        `${API_URL}/findusername?username=${username}`
    )
    return promise
}
function FindAccount(username, password) {
    //console.log(username, password);
    const promise = fetch(
        `${API_URL}/findaccount?username=${username}&password=${password}`
    )
    return promise
}

async function FetchUserStats(username) {
    try{
        const response = await fetch('${API_URL}/user/${username}/stats');
        if (!response.ok) {
            throw new Error('Failed to fetch user stats');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error; 
    }
}

async function UpdateUserStats(username, stats) {
    try {
        const response = await fetch(`${API_URL}/user/${username}/stats`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stats)
        });
        if (!response.ok) {
            throw new Error('Failed to update user stats');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating user stats:', error);
        throw error;
    }
}

async function FetchUserTasks(username) {
    try {
        const response = await fetch(`${API_URL}/user/${username}/tasks`)
        if (!response.ok) throw new Error('Failed to fetch tasks')
        return await response.json()
    } catch (error) {
        console.error('Error fetching tasks:', error)
        throw error
    }
}

async function AddUserTask(username, task) {
    try {
        const response = await fetch(`${API_URL}/user/${username}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task)
        })
        if (!response.ok) throw new Error('Failed to add task')
        return await response.json()
    } catch (error) {
        console.error('Error adding task:', error)
        throw error
    }
}

async function UpdateUserTask(username, taskId, updates) {
    try {
        const response = await fetch(`${API_URL}/user/${username}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        })
        if (!response.ok) throw new Error('Failed to update task')
        return await response.json()
    } catch (error) {
        console.error('Error updating task:', error)
        throw error
    }
}

export { FetchFindUserName, FetchPostUser, FindAccount, FetchUserStats, UpdateUserStats,
    FetchUserTasks, AddUserTask, UpdateUserTask }
