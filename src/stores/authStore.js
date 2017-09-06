import EventEmitter from 'events';
import AppDispatcher from '../dispatcher';

class AuthStore extends EventEmitter {
    constructor() {
        super();

        this.currentUser = null;
        this.token = null;
        this.errorMsg = '';

        // temp user list
        this.users = [
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
    }

    addChangeListenter(callback) {
        this.on('change', callback);
    }

    removeChangeListener(callback) {
        this.removeListener('change', callback);
    }

    emitChange() {
        this.emit('change');
    }

    getCurrentUser() {
        let user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
        return this.currentUser;
    }

    getToken() {
        let userToken = localStorage.getItem('userToken');
        if (userToken) {
            this.token = userToken;
        }
        return this.token;
    }

    getErrorMessage() {
        return this.errorMsg;
    }

    authenticateUser(user) {
        // simulate back-end server call to authenticate user
        let theUser = this.users.find(function (u) {
            return (u.email === user.email) && (u.password === user.password);
        });
        if (theUser) {
            this.errorMsg = ''
            this.currentUser = {
                name: theUser.name,
                email: theUser.email
            };
            this.token = 'jwt.token.fromServer';
            // this is a good place to store the token (if sent from server)
            // and current user data in local or session storage
            localStorage.setItem('userToken', this.token);
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            this.errorMsg = 'Oooops...Email and/or password is invalid';
        }
        this.emitChange();

        /*
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Access-Control-Allow-Origin", "*");
        myHeaders.append("Access-Control-Allow-Credentials", true);

        let body = {
            'grant_type': 'password',
            'client_id': '3MVG9AOp4kbriZOK71vV55So1KI4v8zdHWw2o.1T7KUeFt0Ne4kXsZ3Qv5EdtxakjhtPoIN4LmrqH758wGRnX',
            'client_secret': '4158555451500860294',
            'username': user.email,
            'password': user.password
        };

        let formBody = [];
        for (let prop in body) {
            let encodedKey = encodeURIComponent(prop);
            let encodedValue = encodeURIComponent(body[prop]);
            formBody.push(encodedKey+ "=" + encodedValue);
        }
        formBody = formBody.join('&');
        fetch('http://jasonjones-wsl.internal.salesforce.com:6109/services/oauth2/token', {
            method: 'POST',
            mode: 'cors',
            body: formBody,
            headers: myHeaders
        })
        .then(response => {
            console.log(response);
            console.log(response.text());
        })
        .catch(err => console.log(err));
        */

        /*
        fetch('http://jasonjones-wsl.internal.salesforce.com:6109/services/oauth2/authorize?response_type=token&client_id='+
        encodeURIComponent('3MVG9AOp4kbriZOK71vV55So1KKzy9TMtYwWnooLUlIvjmV8kEQiaWSjTAyrkqrhQs8kLe4G0UBrSbgZVKkUx')+
        '&redirect_uri='+encodeURIComponent('http://localhost:8080') +'&dispay=popup', {
            method: 'GET',
            mode: 'no-cors'
        })
        .then(response => {
            console.log(response);
        })
        .catch(err => console.log(err));
        */
    }

    logoutUser() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUser');
        this.token = '';
        this.currentUser = {};
        this.emitChange();
    }

    handleActions(action) {
        let payload = action.action;
        switch(payload.actionType) {
            case 'AUTHENTICATE_USER':
                this.authenticateUser(payload.data);
                break;

            case 'LOGOUT_USER':
                this.logoutUser(payload.data);
                break;
            default:
        }
    }
}

const authStore = new AuthStore();
AppDispatcher.register(authStore.handleActions.bind(authStore));

export default authStore;
