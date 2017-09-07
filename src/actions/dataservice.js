
// temp user list
const users = [
    {
        name: 'Oliver Queen',
        email: 'oliver@qc.com',
        password: 'arrow'
    },
    {
        name: 'John Diggle',
        email: 'dig@qc.com',
        password: 'spartan'
    }
];

export function getAuthUser(user) {
    return new Promise((resolve, reject) => {
        let theUser = users.find(function (u) {
            return (u.email === user.email) && (u.password === user.password);
        });
        setTimeout(() => {
            if (theUser) {
                resolve(theUser);
            } else {
                reject('Oooops...Email and/or password is invalid');
            }
        }, 1000);

    });
}
