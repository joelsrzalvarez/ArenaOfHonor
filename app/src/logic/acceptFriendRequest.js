import decryptToken from "./decryptToken";

async function acceptFriendRequest(friendId) {
    const userId = decryptToken(sessionStorage.getItem('token')).sub
    const token = sessionStorage.getItem('token');
    
    const response = await fetch(`http://localhost:9000/friends/accept`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, friendId })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to accept friend request: ${errorText}`);
    }

    return await response.json();
}

async function rejectFriendRequest(friendId) {
    const userId = decryptToken(sessionStorage.getItem('token')).sub
    const token = sessionStorage.getItem('token');
    
    const response = await fetch(`http://localhost:9000/friends/reject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, friendId })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to reject friend request: ${errorText}`);
    }

    return await response.json();
}

export { acceptFriendRequest, rejectFriendRequest };
