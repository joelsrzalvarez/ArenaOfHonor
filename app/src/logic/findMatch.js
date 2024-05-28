import { validate, errors } from 'com'

function findMatch(characterId) {
    validate.text(characterId, 'characterId');

    return fetch(`http://localhost:9000/game/findMatch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ characterId })
    })
    .then(res => {
        if (res.ok) {
            console.log('Match finding request successful', res.status);
            return res.json();
        } else {
            throw new Error(`Failed to find match, error status: ${res.status}`);
        }
    })
    .catch(error => {
        console.error('Error finding match:', error);
    });
}

export default findMatch;
