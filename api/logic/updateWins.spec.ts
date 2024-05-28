import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Character } from '../data/index.ts';
import logic from './index.ts';
import { expect } from 'chai';
import { errors } from 'com';

dotenv.config();

const { Types: { ObjectId } } = mongoose;
const { NotFoundError, SystemError } = errors;

describe('updateWins', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL));

    beforeEach(() => Character.deleteMany());

    after(() => mongoose.disconnect());

    it('increments win_streak for an existing character', async () => {
        const playerId = new ObjectId();
        await Character.create({ _id: playerId, name: 'Host', clase: 'Warrior', win_streak: 5, max_win_streak: 5, user_id: new ObjectId() });

        await logic.updateWins(playerId.toString());

        const updatedCharacter = await Character.findById(playerId);
        expect(updatedCharacter).to.not.be.null;
        expect(updatedCharacter.win_streak).to.equal(6);
    });

    it('fails if character is not found', async () => {
        const playerId = new ObjectId().toString();

        try {
            await logic.updateWins(playerId);
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.message).to.equal(`Character with id ${playerId} not found`);
        }
    });

    it('fails if an error occurs during the update', async () => {
        const playerId = 'invalidPlayerId';  // This will cause a cast error

        try {
            await logic.updateWins(playerId);
        } catch (error) {
            expect(error).to.be.instanceOf(SystemError);
        }
    });
});
