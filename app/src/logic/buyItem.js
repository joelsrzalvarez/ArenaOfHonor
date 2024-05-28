function buyItem(userId, itemId) {
    return fetch('http://localhost:9000/shop/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, itemId })
    })
    .then(res => {
        return res.json().then(data => {
            if (!res.ok) {
                throw new Error(data.message);
            }
            return data;
        });
    })
    .catch(error => {
        console.error('Purchase error:', error);
        throw error;
    });
}

export default buyItem;
