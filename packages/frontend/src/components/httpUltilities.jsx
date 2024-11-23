function FetchPostUser(account) {
    const promise = fetch("http://localhost:8001/adduser/", {
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
    const promise = fetch(`http://localhost:8001/findusername?username=${username}`);
    return promise;
  }
  function FindAccount(username, password) {
    //console.log(username, password);
    const promise = fetch (`http://localhost:8001/findaccount?username=${username}&password=${password}`);
    return promise;
  }
  export  {
    FetchFindUserName,
    FetchPostUser,
    FindAccount
  }