import { User } from '../data/index';
import retrieveUser from './retrieveUser';
import { validate, errors } from 'com';

const { NotFoundError, SystemError } = errors;

async function retrieveFriends(userId) {
    validate.text(userId, 'userId', true);

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const friends = await Promise.all(
            user.friends.map(friendId => {
                return retrieveUser(userId, friendId.toString());
            })
        );

        const result = friends.map(friend => ({
            id: friend._id,
            username: friend.username
        }));
        return result;
    } catch (error) {
        console.error('Error in retrieveFriends:', error);
        throw new SystemError(error.message);
    }
}

export default retrieveFriends;
