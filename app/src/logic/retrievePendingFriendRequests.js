import decryptToken from "./decryptToken";

async function retrievePendingFriendRequests() {
    try {
        const userId = decryptToken(sessionStorage.getItem('token')).sub;
        const response = await fetch(`http://localhost:9000/friends/pending/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to retrieve pending friend requests: ${errorText}`);
        }

        const data = await response.json();
        return data.pendingRequests; 
    } catch (error) {
        throw new Error(error.message);
    }
}

export default retrievePendingFriendRequests;
