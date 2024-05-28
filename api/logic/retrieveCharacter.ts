import { Character } from '../data/index.ts';
import { validate, errors } from 'com';

const { SystemError, NotFoundError } = errors;

function retrieveCharacter(userId: string): Promise<Character[]> {
    validate.text(userId, 'userId');

    return Character.find({ user_id: userId }) 
        .catch(error => {
            throw new SystemError(error.message);
        })
        .then(characters => {
            if (!characters || characters.length === 0) {
                throw new NotFoundError('No characters found for the given user and page');
            }
            return characters;
        });
}

export default retrieveCharacter;
