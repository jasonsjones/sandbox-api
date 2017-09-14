
const baseUrl = 'http://localhost:3000/api';

export function getAuthUser(user) {
    const url = `${baseUrl}/login`;
    if (!user.email || !user.password) return;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                resolve(data);
            } else {
                reject(data.message);
            }
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

export function signupUser(user) {
    const url = `${baseUrl}/signup`;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                resolve(data);
            } else {
                reject(data.message);
            }
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });

    });

}
