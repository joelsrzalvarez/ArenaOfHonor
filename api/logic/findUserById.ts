import { User } from '../data/index';
import { NotFoundError, SystemError } from 'com/errors';

function findUserById(userId) {
    try {
        const user = User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    } catch (error) {
        console.error('Error finding user by ID:', error);
        throw new SystemError('Error finding user');
    }
}

export default findUserById;
