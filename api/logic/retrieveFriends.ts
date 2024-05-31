// logic/retrieveFriends.js (servidor)
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
            user.friends.map(friendId => retrieveUser(userId, friendId.toString()))
        );

        return friends.map(friend => ({
            name: friend.name.toString()
        }));
    } catch (error) {
        throw new SystemError(error.message);
    }
}

export default retrieveFriends;
