async function sendMessage(senderId, recipientId, text) {
    try {
        const response = await fetch('http://localhost:9000/chats/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify({ senderId, recipientId, text })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send message: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

export default sendMessage;
