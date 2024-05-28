import { validate, errors } from 'com';

function updateWins(playerId, loserId) {
    validate.text(playerId, 'playerId');
    validate.text(loserId, 'loserId');

    return fetch(`http://localhost:9000/characters/${playerId}/${loserId}/updateWins`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json().then(err => {
                throw new Error(`Failed to update wins, error: ${err.message}`);
            });
        }
    })
    .then(data => {
        console.log('Success:', data.message);
    })
    .catch(error => {
        console.error('Update wins error:', error);
    });
}

export default updateWins;
