import { validate, errors } from 'com';
import { Character, User } from '../data/index.ts';
import mongoose from 'mongoose';

const { SystemError, NotFoundError } = errors;

async function updateWins(playerId: string, loserId: string): Promise<void> {
    validate.text(playerId, 'playerId');
    validate.text(loserId, 'loserId');

    try {
        const character = await Character.findById(playerId);
        const characterLoser = await Character.findById(loserId);

        if (!character) {
            throw new NotFoundError(`Character with id ${playerId} not found`);
        }
        if (!characterLoser) {
            throw new NotFoundError(`Character with id ${loserId} not found`);
        }

        const userId = character.user_id;

        const newWinStreakLoser = Math.max(0, characterLoser.win_streak - 18);

        const characterUpdate = Character.updateOne(
            { _id: playerId },
            { $inc: { win_streak: 30 } }
        );

        const characteraLoserUpdate = Character.updateOne(
            { _id: loserId },
            { $set: { win_streak: newWinStreakLoser } }
        );

        const userUpdate = User.updateOne(
            { _id: userId },
            { $inc: { honor_points: 10 } }
        );

        await Promise.all([characteraLoserUpdate, characterUpdate, userUpdate]);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new SystemError('Invalid character ID format');
        } else if (error instanceof NotFoundError) {
            throw error;
        } else {
            throw new SystemError(error.message);
        }
    }
}

export default updateWins;
