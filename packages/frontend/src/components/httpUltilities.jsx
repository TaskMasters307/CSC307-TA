const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8001'
  : 'https://taskarena-hxd7fcczhcdgfnch.westus3-01.azurewebsites.net';

function FetchPostUser(account) {
    const promise = fetch(`${API_URL}/adduser/`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(account),
        }
    )
    //console.log(`function postUser(account) account = ${JSON.stringify(account)}`);
    //console.log(`postUser: ${account}`)
    return promise
}

function FetchFindUserName(username) {
    const promise = fetch(
        `${API_URL}/findusername?username=${username}`);
    return promise
}
function FindAccount(username, password) {
    //console.log(username, password);
    const promise = fetch(
         `${API_URL}/findaccount?username=${username}&password=${password}`
    )
    return promise
}
export { FetchFindUserName, FetchPostUser, FindAccount }
