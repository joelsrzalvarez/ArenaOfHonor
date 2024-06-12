import { User } from '../data/index.ts';
import { SystemError, NotFoundError } from 'com/errors';

function updateUserStatus(userId, status) {
    return User.findById(userId)
        .then(user => {
            if (!user) {
                throw new NotFoundError('User not found');
            }

            user.status = status;
            return user.save();
        })
        .then(user => user.status)
        .catch(error => {
            throw new SystemError(error.message);
        });
}

export default updateUserStatus;
