import { validate, errors } from 'com';

function logoutUser() {
    const token = sessionStorage.getItem('token');

    if (!token) {
        throw new Error('No token found');
    }

    return fetch('http://localhost:9000/users/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
    })
    .then(() => {
        delete sessionStorage.token;
        
    })
    .catch(error => {
        console.error('Failed to logout:', error);
        throw error;
    });
}

export default logoutUser;
