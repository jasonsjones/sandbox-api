import authStore from '../stores/authStore';

const baseUrl = 'http://localhost:3000/api';

export function getAuthUser(user, path) {
    const url = `${baseUrl}/${path}`;
    if (!user.email || !user.password) return;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        .then(response => {
            // if the response status is 200 OK, then we know we are getting
            // a json payload back
            if (response.status === 200) {
                return response.json();
            }
            // any other response status is likely to be just text (e.g., 'Unauthorized')
            return response.text();
        })
        .then(data => {
            if (data.success) {
                resolve(data);
            } else if (!data.success && data.message) {
                reject(data.message);
            } else {
                reject(data);
            }
        })
        .catch(err => {
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

export function updateUserAvatar(newAvatar) {
    let user = authStore.getCurrentUser();
    let token = authStore.getToken();

    const url = `${baseUrl}/user/${user.id}/avatar`;
    let formData = new FormData();
    formData.append("avatar", newAvatar);

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {'x-access-token': token},
            body: formData
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

export function updateUserProfile(newUserData) {
    const userId = authStore.getCurrentUser().id;
    const url = `${baseUrl}/user/${userId}`;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUserData)
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

export function getSessionUser() {
    const url = `${baseUrl}/sessionUser`;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
        })
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    });
}
