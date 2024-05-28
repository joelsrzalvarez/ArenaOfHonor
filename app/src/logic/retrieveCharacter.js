import { validate, errors } from 'com';

function retrieveCharacter(userId) {
    if (typeof sessionStorage.token !== 'string') {
        console.error('Token is not available or not a string');
        return Promise.reject(new Error('Token is not available or not a string'));
    }

    validate.text(userId, 'userId', true);

    const [, payloadB64] = sessionStorage.token.split('.');
    const payloadJSON = atob(payloadB64);
    const payload = JSON.parse(payloadJSON);
    const { sub: tokenUserId } = payload;

    if (tokenUserId !== userId) {
        console.error('Token user ID does not match requested user ID');
        return Promise
        .reject(new Error('Token user ID does not match requested user ID'));
    }

    return fetch(`http://localhost:9000/characters?userId=${userId}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`
        }
    })
    .then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            throw new Error(`Failed to fetch, error status: ${res.status}`);
        }
    })
}

export default retrieveCharacter;
