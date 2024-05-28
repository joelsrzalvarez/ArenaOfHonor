import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Character } from '../data/index.ts';
import logic from './index.ts';
import { expect } from 'chai';
import { errors } from 'com';

dotenv.config();

const { Types: { ObjectId } } = mongoose;
const { NotFoundError } = errors;

describe('retrieveCharacter', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL));

    beforeEach(() => Character.deleteMany());

    after(() => mongoose.disconnect());

    it('retrieves existing character for a given user ID', async () => {
        const userId = '664b493ef40ab9f4be55721f';
        const characterData = [
            { user_id: userId, name: 'Character1', clase: 'Warrior', win_streak: 5, max_win_streak: 0  },
            { user_id: userId, name: 'Character2', clase: 'Mage', win_streak: 3, max_win_streak: 0  }
        ];

        await Character.create(characterData);

        const characters = await logic.retrieveCharacter(userId);
        
        expect(characters).to.have.lengthOf(2);
        expect(characters[0]).to.include({ name: 'Character1', clase: 'Warrior', win_streak: 5, max_win_streak: 0 });
        expect(characters[1]).to.include({ name: 'Character2', clase: 'Mage', win_streak: 3,  max_win_streak: 0 });
    });

    it('no characters are found for a given userid', async () => {
        const userId = '664b493ef40ab9f4be55721f';

        try {
            await logic.retrieveCharacter(userId);
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });

    it('error occurs while retrieving characters', async () => {
        const userId = 'invalidUserId';

        try {
            await logic.retrieveCharacter(userId);
        } catch (error) {
            expect(error).to.be.instanceOf(errors.SystemError);
        }
    });
});
