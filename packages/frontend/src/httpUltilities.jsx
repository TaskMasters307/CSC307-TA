function FetchPostUser(account) {
    const promise = fetch('http://localhost:8001/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(account),
    })
    //console.log(`function postUser(account) account = ${JSON.stringify(account)}`);
    //console.log(`postUser: ${account}`)
    return promise
}

function FetchLogin(account) {
    const promise = fetch('http://localhost:8001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(account),
    })
    //console.log(`function postUser(account) account = ${JSON.stringify(account)}`);
    //console.log(`postUser: ${account}`)
    return promise
}

function FetchFindUserName(username) {
    const promise = fetch(
        `http://localhost:8001/findusername?username=${username}`
    )
    return promise
}
function FindAccount(username, password) {
    //console.log(username, password);
    const promise = fetch(
        `http://localhost:8001/findaccount?username=${username}&password=${password}`
    )
    return promise
}

async function FetchAddTask(task) {
    if (!task.userId || !task.title || !task.date) {
        throw new Error('Invalid task data: Missing required fields');
    }

    const response = await fetch('http://localhost:8001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add task');
    }

    return response.json();
}

const FetchTasks = async (userId) => {
    const response = await fetch(`http://localhost:8001/tasks?userId=${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
};


const FetchUpdateTask = async (taskId, updates) => {
    const response = await fetch(`http://localhost:8001/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error('Failed to update task');
    }

    return response.json();
};

function FetchDeleteTask(taskId) {
    return fetch(`http://localhost:8001/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export {
    FetchFindUserName,
    FetchPostUser,
    FindAccount,
    FetchLogin,
    FetchAddTask,
    FetchTasks,
    FetchUpdateTask,
    FetchDeleteTask,
};
