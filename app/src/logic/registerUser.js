import { validate, errors } from 'com'

function registerUser(name, surname, email, password, honor_points, arena_points, vip, avatar) {
    validate.text(name, 'name')
    validate.text(surname, 'surname')
    validate.email(email)
    validate.password(password)
    validate.text(avatar, 'avatar')

    const user = { 
        name, 
        surname, 
        email, 
        password, 
        honor_points, 
        arena_points, 
        vip, 
        avatar,
        friends: [],
        pendingFriendRequests: []
    }

    const json = JSON.stringify(user)

    return fetch(`http://localhost:9000/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: json
    })
        .then(res => {
            if (res.status === 201) return

            return res.json()
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error]

                    throw new constructor(message)
                })
        })
}

export default registerUser
