import decryptToken from './decryptToken';

async function retrieveMessages(friendId) {
    try {
        const token = sessionStorage.getItem('token');
        const senderId = decryptToken(token).sub;

        const response = await fetch(`http://localhost:9000/chats/${senderId}/${friendId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to retrieve messages: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

export default retrieveMessages;
