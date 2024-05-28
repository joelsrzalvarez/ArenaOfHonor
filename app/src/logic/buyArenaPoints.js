function buyArenaPoints(userId, quantity) {
    return fetch('http://localhost:9000/shop/buyArenaPoints', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, quantity })
    })
    .then(res => {
        return res.json().then(data => {
            if (!res.ok) {
                throw new Error(data.message);
            }
            return data.arena_points;
        });
    })
    .catch(error => {
        console.error('Purchase error:', error);
        throw error;
    });
}

export default buyArenaPoints;
