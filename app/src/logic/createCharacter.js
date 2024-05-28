import { validate, errors } from 'com'

function createCharacter(name, clase, win_streak, max_win_streak, user_id, page) {
    validate.text(name, 'name')
    validate.text(clase, 'clase')

    const character = { name, clase, win_streak, max_win_streak, user_id, page }

    const json = JSON.stringify(character)

    return fetch(`http://localhost:9000/characters`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: json
    })
        .then(res => {
            if (res.status === 201) {
                return res.json();
            } else if (res.status >= 400) {
                return res.json().then(body => {
                    const { error, message } = body
                    const ErrorConstructor = errors[error] || Error;
                    throw new ErrorConstructor(message);
                });
            }
        })
}

export default createCharacter;
