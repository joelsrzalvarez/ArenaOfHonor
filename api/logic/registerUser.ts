import { validate, errors } from 'com'
import { UserType, User } from '../data/index.ts'
import { StringSchemaDefinition } from 'mongoose'

const { DuplicityError, SystemError } = errors

function registerUser(
    name: string,
    surname: string,
    username: string,
    email: string,
    password: string,
    honor_points: number,
    arena_points: number,
    vip: boolean,
    avatar: string
): Promise<void> {
    validate.text(name, 'name')
    validate.text(surname, 'surname')
    validate.text(username, 'username')
    validate.email(email)
    validate.password(password)
    validate.text(avatar, 'avatar')

    return User.findOne({ $or: [{ email }] })
        .catch(error => { throw new SystemError(error.message) })
        .then((user: UserType) => {
            if (user) throw new DuplicityError('user already exists')

            user = {
                name: name.trim(),
                surname: surname,
                username: username,
                email: email,
                password: password,
                honor_points: honor_points,
                arena_points: arena_points,
                vip: vip,
                avatar: avatar,
                inventory: [],
                friends: [],
                pendingFriendRequests: []
            }

            return User.create(user)
                .catch(error => { throw new SystemError(error.message) })
                .then(user => { })
        })
}

export default registerUser
