import { validate, errors } from 'com';

function updateUserPassword(token, newPassword) {
    validate.text(token, 'token');
    validate.text(newPassword, 'newPassword');
    console.log(token)
    return fetch(`http://localhost:9000/users/${token}/updatePassword`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPassword })
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json().then(err => {
                throw new Error(`Failed to update password, error: ${err.message}`);
            });
        }
    })
    .then(data => {
        console.log('Success:', data.message);
    })
    .catch(error => {
        console.error('Update password error:', error);
    });
}

export default updateUserPassword;
