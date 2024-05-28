import { validate, errors } from 'com'

function logoutUser() {
    delete sessionStorage.token
}

export default logoutUser