function getEloFromCharacter(userId) {
    return fetch(`http://localhost:9000/characters/elo?userId=${userId}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Failed to fetch, error status: ${res.status}`);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        throw error;
    });
}

export default getEloFromCharacter;
