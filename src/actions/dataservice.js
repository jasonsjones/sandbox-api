
export function getAuthUser(user) {
    const url = 'http://localhost:3000/api/login';
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
