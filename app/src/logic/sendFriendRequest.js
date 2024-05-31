import decryptToken from "./decryptToken";

async function sendFriendRequest(friendEmail) {
    const myId = decryptToken(sessionStorage.getItem('token')).sub;

    try {
        const response = await fetch(`http://localhost:9000/users/email/${friendEmail}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to find user: ${errorText}`);
        }

        const { userId } = await response.json();
        console.log(`User ID: ${userId}`); 

        const friendRequestResponse = await fetch(`http://localhost:9000/friends/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify({ userId: myId, friendId: userId })
        });

        if (!friendRequestResponse.ok) {
            const errorText = await friendRequestResponse.text();
            throw new Error(`Failed to send friend request: ${errorText}`);
        }

        return `Friend request sent to: ${friendEmail}`;
    } catch (error) {
        throw new Error(error.message);
    }
}

export default sendFriendRequest;
