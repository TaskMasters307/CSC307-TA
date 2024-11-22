import { FetchFindUserName, FindAccount } from './httpUltilities'

function Is_User_Name_Exist(uname) {
    return FetchFindUserName(uname)
        .then((res) => {
            if (!res.ok) {
                throw new Error('checking User Name error')
            }
            return res.json()
        })
        .then((data) => {
            //console.log(data, data.exits);
            return data.exits
        })
        .catch((error) => {
            console.log(error)
        })
}
function MatchAccount(account) {
    //this return promise
    //res.send({Login: <true/false>})
    // res.status(201) if account is found
    // res.status(404) if account is NOT found

    return FindAccount(account.username, account.password)
}

export { Is_User_Name_Exist, MatchAccount }
