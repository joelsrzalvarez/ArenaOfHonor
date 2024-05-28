import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../data/index.ts';
import logic from './index.ts';
import { expect } from 'chai';
import { errors } from 'com';

dotenv.config();

const { DuplicityError, SystemError } = errors;

process.env.NODE_ENV = 'test';

describe('registerUser', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL));

    beforeEach(() => User.deleteMany());

    after(() => mongoose.disconnect());

    it('registers a new user successfully', async () => {
        const name = 'John';
        const surname = 'Doe';
        const email = 'john.doe@example.com';
        const password = '123qwe123';

        await logic.registerUser(name, surname, email, password);

        const user = await User.findOne({ email });
        expect(user).to.not.be.null;
        expect(user.name).to.equal(name);
        expect(user.surname).to.equal(surname);
        expect(user.email).to.equal(email);
        expect(user.password).to.equal(password);
    });

    it('fails if user already exists', async () => {
        const name = 'Jane';
        const surname = 'Doe';
        const email = 'jane.doe@example.com';
        const password = '123qwe123';

        await User.create({ name, surname, email, password });

        try {
            await logic.registerUser(name, surname, email, password);
        } catch (error) {
            expect(error).to.be.instanceOf(DuplicityError);
            expect(error.message).to.equal('user already exists');
        }
    });

    it('fails if there is a system error', async () => {
        const name = 'Jane';
        const surname = 'Doe';
        const email = 'jane.doe@example.com';
        const password = '123qwe123';

        try {
            await logic.registerUser(name, surname, email, password);
        }catch (error) {
            expect(error).to.be.instanceOf(SystemError);
            expect(error.message).to.equal('user already exists');
        }
    });
});
