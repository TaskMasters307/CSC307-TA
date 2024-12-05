const URL = "https://backend-task-arena-bhaxftapffehhhcj.westus3-01.azurewebsites.net"
// const URL = "http://localhost:8001"

// Helper function to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

function FetchSignUp(account) {
    const promise = fetch(`${URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(account)
    }).then(response => {
        if (response.ok) {
            return response.json().then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                return data;
            });
        }
        return Promise.reject(response);
    });
    return promise;
}

function FetchLogin(account) {
    const promise = fetch(`${URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(account)
    }).then(response => {
        if (response.ok) {
            return response.json().then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                return data;
            });
        }
        return Promise.reject(response);
    });
    return promise;
}

function FetchFindUserName(username) {
    const promise = fetch(`${URL}/findusername?username=${username}`, {
        headers: {
            ...getAuthHeader()
        }
    });
    return promise;
}

function FindAccount(username, password) {
    const promise = fetch(`${URL}/findaccount?username=${username}&password=${password}`, {
        headers: {
            ...getAuthHeader()
        }
    });
    return promise;
}

// New helper function for authenticated requests
function makeAuthenticatedRequest(endpoint, options = {}) {
    const promise = fetch(`${URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            ...getAuthHeader()
        }
    });
    return promise;
}

// Function to check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Function to logout (remove token)
function logout() {
    localStorage.removeItem('token');
}

export {
    FetchFindUserName,
    FetchSignUp,
    FindAccount,
    FetchLogin,
    makeAuthenticatedRequest,
    isAuthenticated,
    logout
};