import { validate, errors } from 'com';

function deleteCharacter(idDelete) {
    validate.text(idDelete, 'idDelete');

    return fetch(`http://localhost:9000/characters/${idDelete}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`
        }
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Failed to delete, error status: ${res.status}`);
        }
    })
    .catch(error => {
        console.error('Deletion error:', error);
    });
}

export default deleteCharacter;
