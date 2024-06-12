import {User} from '../data/index.ts';

async function getUsernameFriendRequest(username) {
    try {
        const user = await User.findOne({ username });
        console.log(user)
        if (!user) {
            throw new Error('User not found');
        }
        return user._id;
    } catch (error) {
        throw new Error(error.message);
    }
}

export default getUsernameFriendRequest;
