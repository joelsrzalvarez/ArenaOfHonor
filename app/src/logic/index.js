import registerUser from './registerUser'
import loginUser from './loginUser'
import retrieveUser from './retrieveUser'
import createCharacter from './createCharacter'
import logoutUser from './logoutUser'
import decryptToken from './decryptToken'
import isUserLoggedIn from './isUserLoggedIn'
import cleanUpLoggedInUserId from './cleanUpLoggedInUserId'
import findMatch from './findMatch'
import retrieveRanking from './retrieveRanking'
import retrieveShop from './retrieveShop'
import buyItem from './buyItem'
import buyArenaPoints from './buyArenaPoints'
import moveImage from './moveImage'
import updateWins from './updateWins'
import getEloFromCharacter from './getEloFromCharacter'
import updateUserPassword from './updateUserPassword'

const logic = {
    registerUser,
    loginUser,
    retrieveUser,
    createCharacter,
    logoutUser,
    decryptToken,
    isUserLoggedIn,
    cleanUpLoggedInUserId,
    findMatch,
    retrieveRanking,
    retrieveShop,
    buyItem,
    buyArenaPoints,
    moveImage,
    updateWins,
    getEloFromCharacter,
    updateUserPassword
}

export default logic