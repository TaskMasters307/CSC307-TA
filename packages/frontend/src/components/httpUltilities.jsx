const URL = "https://backend-task-arena-bhaxftapffehhhcj.westus3-01.azurewebsites.net"
//const URL = "http://localhost:8001"
function FetchSignUp(account) {
    const promise = fetch(`${URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(account)
    });
    //console.log(`function postUser(account) account = ${JSON.stringify(account)}`);
    //console.log(`postUser: ${account}`)
    return promise;

  }

  function FetchLogin(account) {
    const promise = fetch(`${URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(account)
    });
    //console.log(`function postUser(account) account = ${JSON.stringify(account)}`);
    //console.log(`postUser: ${account}`)
    return promise;

  }

  function FetchFindUserName(username) {
    const promise = fetch(`${URL}/findusername?username=${username}`);
    return promise;
  }
  function FindAccount(username, password) {
    //console.log(username, password);
    const promise = fetch (`${URL}/findaccount?username=${username}&password=${password}`);
    return promise;
  }
  export  {
    FetchFindUserName,
    FetchSignUp,
    FindAccount,
    FetchLogin
  }
