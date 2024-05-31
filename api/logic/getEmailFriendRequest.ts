import {User} from '../data/index.ts';

async function getEmailFriendRequest(email) {
    try {
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            throw new Error('User not found');
        }
        return user._id;
    } catch (error) {
        throw new Error(error.message);
    }
}

export default getEmailFriendRequest;
