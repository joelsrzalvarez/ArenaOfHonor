import { validate, errors } from 'com';
import { User } from '../data/index.ts';

const { SystemError, NotFoundError } = errors;

async function updateUserPassword(userId, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError(`User with id ${userId} not found`);
    }
    user.password = newPassword;
    await user.save();
}

export default updateUserPassword;
