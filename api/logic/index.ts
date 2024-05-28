import registerUser from './registerUser.ts'
import createCharacter from './createCharacter.ts'
import authenticateUser from './authenticateUser.ts'
import retrieveUser from './retrieveUser.ts'
import retrieveCharacter from './retrieveCharacter.ts'
import deleteCharacter from './deleteCharacter.ts'
import { handleMatchMaking } from './findMatch.ts'
import retrieveRanking from './retrieveRanking.ts'
import retrieveShop from './retrieveShop.ts'
import buyItem from './buyItem.ts'
import buyArenaPoints from './buyArenaPoints.ts'
import updateWins from './updateWins.ts';
import getEloFromCharacter from './getEloFromCharacter.ts'

const logic = {
    registerUser,
    createCharacter,
    authenticateUser,
    retrieveUser,
    retrieveCharacter,
    deleteCharacter,
    handleMatchMaking,
    retrieveRanking,
    retrieveShop,
    buyItem,
    buyArenaPoints,
    updateWins,
    getEloFromCharacter
}

export default logic