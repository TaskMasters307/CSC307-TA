function FetchPostUser(account) {
    const promise = fetch(
        'https://taskarena-hxd7fcczhcdgfnch.westus3-01.azurewebsites.net/adduser/',
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
        `https://taskarena-hxd7fcczhcdgfnch.westus3-01.azurewebsites.net/findusername?username=${username}`
    )
    return promise
}
function FindAccount(username, password) {
    //console.log(username, password);
    const promise = fetch(
        `https://taskarena-hxd7fcczhcdgfnch.westus3-01.azurewebsites.net/findaccount?username=${username}&password=${password}`
    )
    return promise
}
export { FetchFindUserName, FetchPostUser, FindAccount }
