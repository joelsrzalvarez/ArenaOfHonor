import registerUser from './registerUser.ts'
import createCharacter from './createCharacter.ts'
import authenticateUser from './authenticateUser.ts'
import retrieveUser from './retrieveUser.ts'
import retrieveCharacter from './retrieveCharacter.ts'
import deleteCharacter from './deleteCharacter.ts'
import { handleMatchMaking, handleCancelMatchMaking } from './findMatch.ts'
import retrieveRanking from './retrieveRanking.ts'
import retrieveShop from './retrieveShop.ts'
import buyItem from './buyItem.ts'
import buyArenaPoints from './buyArenaPoints.ts'
import updateWins from './updateWins.ts';
import getEloFromCharacter from './getEloFromCharacter.ts'
import updateUserPassword from './updateUserPassword.ts'
import getEmailFriendRequest from './getEmailFriendRequest.ts'
import sendFriendRequest from './sendFriendRequest.ts'
import { acceptFriendRequest, rejectFriendRequest } from './acceptFriendRequest.ts'
import retrievePendingFriendRequests from './retrievePendingFriendRequests.ts'
import retrieveFriends from './retrieveFriends.ts'
import sendMessage from './sendMessage.ts'
import retrieveMessages from './retrieveMessages.ts'

const logic = {
    registerUser,
    createCharacter,
    authenticateUser,
    retrieveUser,
    retrieveCharacter,
    deleteCharacter,
    handleMatchMaking,
    handleCancelMatchMaking,
    retrieveRanking,
    retrieveShop,
    buyItem,
    buyArenaPoints,
    updateWins,
    getEloFromCharacter,
    updateUserPassword,
    getEmailFriendRequest,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    retrievePendingFriendRequests,
    retrieveFriends,
    sendMessage,
    retrieveMessages
}

export default logic