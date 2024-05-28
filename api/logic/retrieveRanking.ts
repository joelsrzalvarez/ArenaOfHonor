import { Character } from '../data/index.ts';
import { errors } from 'com';
const { SystemError } = errors;

async function retrieveRanking() {
  try {
    const characters = await Character.find();
    return characters;
  } catch (error) {
    throw new SystemError('Error retrieving characters: ' + error.message);
  }
}

export default retrieveRanking;
