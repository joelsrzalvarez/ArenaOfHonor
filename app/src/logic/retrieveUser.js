import { validate, errors } from 'com';

function retrieveUser() {
    
    if (typeof sessionStorage.token !== 'string') {
        console.error('Token is not available or not a string');
        return Promise.reject(new Error('Token is not available or not a string'));
    }

    validate.token(sessionStorage.token);

    const [, payloadB64] = sessionStorage.token.split('.');
    const payloadJSON = atob(payloadB64);
    const payload = JSON.parse(payloadJSON);
    const { sub: userId } = payload;

    return fetch(`http://localhost:9000/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`
        }
    })
    .then(res => {
        if (res.status === 200) return res.json();
        return res.json().then(body => {
            const { error, message } = body;
            const constructor = errors[error];
            throw new constructor(message);
        });
    });
}

export default retrieveUser;
