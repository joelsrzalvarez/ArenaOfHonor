function extractJwtPayload(token) {
    const [, payloadB64] = token.split('.')

    const payloadJSON = atob(payloadB64)

    const payload = JSON.parse(payloadJSON)

    return payload
}

const util = {
    extractJwtPayload
}

export default util