import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Character } from '../data/index.ts';
import logic from './index.ts';
import { expect } from 'chai';
import { errors } from 'com';

dotenv.config();

const { SystemError } = errors;

describe('retrieveRanking', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL));

    beforeEach(() => Character.deleteMany());

    after(() => mongoose.disconnect());

    it('should return a list of characters', async () => {
        const originalFind = Character.find;
        Character.find = () => {
            throw new Error('Forced error for testing');
        };

        try {
            await logic.retrieveRanking();
        } catch (error) {
            expect(error).to.be.instanceOf(SystemError);
            expect(error.message).to.equal('Error retrieving characters: Forced error for testing');
        } finally {
            Character.find = originalFind;
        }
    });

    it('if there is a problem retrieving characters', async () => {
        const originalFind = Character.find;
        Character.find = () => {
            throw new Error('Forced error for testing');
        };

        try {
            await logic.retrieveRanking();
        } catch (error) {
            expect(error).to.be.instanceOf(SystemError);
            expect(error.message).to.equal('Error retrieving characters: Forced error for testing');
        } finally {
            Character.find = originalFind;
        }
    });
});
