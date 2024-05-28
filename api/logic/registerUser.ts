import { validate, errors } from 'com'

import { UserType, User } from '../data/index.ts'

const { DuplicityError, SystemError } = errors

function registerUser(name: string, surname: string, email: string, password: string, honor_points: number, arena_points: number): Promise<void> {
    validate.text(name, 'name')
    validate.text(surname, 'surname')
    validate.email(email)
    validate.password(password)

    return User.findOne({ $or: [{ email }] })
        .catch(error => { throw new SystemError(error.message) })
        .then((user: UserType) => {
            if (user)
                throw new DuplicityError('user already exists')

            user = {
                name: name.trim(),
                surname: surname, 
                email: email,
                password: password,
                honor_points: honor_points,
                arena_points: arena_points
            }

            return User.create(user)
                .catch(error => { throw new SystemError(error.message) })
                .then(user => { })
        })
}

export default registerUser