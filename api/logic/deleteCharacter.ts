import { Character } from '../data/index.ts';
import mongoose from 'mongoose';
import { validate, errors } from 'com';

const { SystemError, NotFoundError } = errors;

async function deleteCharacter(characterId: string): Promise<void> {
    validate.text(characterId, 'characterId');

    try {
        const deletedCharacter = await Character.findByIdAndDelete(characterId);
        if (!deletedCharacter) {
            throw new NotFoundError('Character not found');
        }
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new SystemError('Invalid character ID format');
        }
        throw new SystemError(error.message);
    }
}

export default deleteCharacter;
