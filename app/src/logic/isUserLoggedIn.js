import { validate } from 'com'

function isUserLoggedIn() {
    try {
        validate.token(sessionStorage.token)

        return !!sessionStorage.token
    } catch (error) {
        return false
    }

}

export default isUserLoggedIn