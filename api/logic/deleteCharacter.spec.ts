import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Character } from '../data/index.ts';
import logic from './index.ts';
import { expect } from 'chai';
import { errors } from 'com';

dotenv.config();

const { Types: { ObjectId } } = mongoose;
const { NotFoundError, SystemError } = errors;

describe('deleteCharacter', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL));

    beforeEach(() => Character.deleteMany());

    after(() => mongoose.disconnect());

    it('deletes an existing character', async () => {
        const characterId = new ObjectId();
        await Character.create({ _id: characterId, name: 'Character1', clase: 'Warrior', win_streak: 5, max_win_streak: 5, user_id: new ObjectId() });

        await logic.deleteCharacter(characterId.toString());

        const deletedCharacter = await Character.findById(characterId);
        expect(deletedCharacter).to.be.null;
    });

    it('fails if character is not found', async () => {
        const characterId = new ObjectId().toString();

        try {
            await logic.deleteCharacter(characterId);
        } catch (error) {
            expect(error.message).to.equal('Character not found');
        }
    });

    it('error occurs during deletion', async () => {
        const characterId = 'invalidCharacterId';

        try {
            await logic.deleteCharacter(characterId);
        } catch (error) {
            expect(error).to.be.instanceOf(SystemError);
            expect(error.message).to.equal('Invalid character ID format');
        }
    });
});
