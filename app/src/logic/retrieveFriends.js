import decryptToken from './decryptToken';

async function retrieveFriends() {
    const token = sessionStorage.getItem('token');
    const userId = decryptToken(token).sub;

    try {
        const response = await fetch(`http://localhost:9000/friends/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to retrieve friends: ${errorText}`);
        }

        const friends = await response.json();
        return friends;
    } catch (error) {
        throw new Error(error.message);
    }
}

export default retrieveFriends;
