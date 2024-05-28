import { validate, errors } from 'com';
import { Character } from '../data/index.ts';
import mongoose from 'mongoose';

const { DuplicityError, SystemError } = errors;

async function createCharacter(name: string, clase: string, win_streak: number, max_win_streak: number, userId: mongoose.Types.ObjectId) {
    validate.text(name, 'name');
    validate.text(clase, 'clase');

    if (win_streak !== 0 || max_win_streak !== 0) {
        throw new SystemError('win_streak and max_win_streak must be 0 when creating a character');
    }

    const validClasses = ['warrior', 'mage', 'assassin'];
    if (!validClasses.includes(clase.toLowerCase())) {
        throw new SystemError('Invalid class provided');
    }

    try {
        const characterExists = await Character.findOne({ name, user_id: userId });

        if (characterExists) {
            throw new DuplicityError('Character with this name already exists for the given user');
        }

        const newCharacter = {
            name: name.trim(),
            clase,
            win_streak: 0,
            max_win_streak: 0,
            user_id: userId,
        };

        await Character.create(newCharacter); 
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            throw new SystemError('Validation error in creating character');
        } else {
            throw error;
        }
    }
}

export default createCharacter;
