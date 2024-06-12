import { validate } from 'com';

function isUserLoggedIn() {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            return false;
        }

        const response = fetch('http://localhost:9000/users/verify-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const result = response.json();
            return result.isValid;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Failed to verify user token:', error);
        return false;
    }
}

export default isUserLoggedIn;
