import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Character } from '../data/index.ts';
import logic from './index.ts';
import { expect } from 'chai';
import { errors } from 'com';

dotenv.config();

const { DuplicityError, SystemError } = errors;

describe('createCharacter', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL));

    beforeEach(() => Character.deleteMany());

    after(() => mongoose.disconnect());

    it('creates a new character successfully', async () => {
        const name = 'Character1';
        const clase = 'warrior';
        const userId = new mongoose.Types.ObjectId();

        await logic.createCharacter(name, clase, 0, 0, userId);

        const character = await Character.findOne({ name, user_id: userId });
        expect(character).to.not.be.null;
        expect(character.name).to.equal(name);
        expect(character.clase).to.equal(clase);
        expect(character.win_streak).to.equal(0);
        expect(character.max_win_streak).to.equal(0);
        expect(character.user_id.toString()).to.equal(userId.toString());
    });

    it('if an invalid class is provided', async () => {
        const name = 'Character2';
        const clase = 'invalid_class';
        const userId = new mongoose.Types.ObjectId();

        try {
            await logic.createCharacter(name, clase, 0, 0, userId);
        } catch (error) {
            expect(error).to.be.instanceOf(SystemError);
            expect(error.message).to.equal('Invalid class provided');
        }
    });

    it('if win_streak is greater than 0', async () => {
        const name = 'Character3';
        const clase = 'mage';
        const userId = new mongoose.Types.ObjectId();

        try {
            await logic.createCharacter(name, clase, 1, 0, userId);
        } catch (error) {
            expect(error).to.be.instanceOf(SystemError);
            expect(error.message).to.equal('win_streak and max_win_streak must be 0 when creating a character');
        }
    });

    it('if max_win_streak is greater than 0', async () => {
        const name = 'Character4';
        const clase = 'assassin';
        const userId = new mongoose.Types.ObjectId();

        try {
            await logic.createCharacter(name, clase, 0, 1, userId);
        } catch (error) {
            expect(error).to.be.instanceOf(SystemError);
            expect(error.message).to.equal('win_streak and max_win_streak must be 0 when creating a character');
        }
    });

    it('there is a validation error', async () => {
        const name = 'Host'; 
        const clase = 'mage';
        const userId = new mongoose.Types.ObjectId();

        try {
            await logic.createCharacter(name, clase, 0, 0, userId);
        } catch (error) {
            expect(error).to.be.instanceOf(SystemError);
            expect(error.message).to.equal('Validation error in creating character');
        }
    });

    it('does not create duplicate characters for the same user', async () => {
        const name = 'Character5';
        const clase = 'warrior';
        const userId = new mongoose.Types.ObjectId();

        await logic.createCharacter(name, clase, 0, 0, userId);

        try {
            await logic.createCharacter(name, clase, 0, 0, userId);
        } catch (error) {
            expect(error).to.be.instanceOf(DuplicityError);
            expect(error.message).to.equal('Character with this name already exists for the given user');
        }
    });
});
