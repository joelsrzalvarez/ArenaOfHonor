import { User } from '../data/index';

async function sendFriendRequest(userId, friendId) {
    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            throw new Error('User not found');
        }

        if (!user.friends.includes(friendId)) {
            user.friends.push(friendId);
            await user.save();
        }

        if (!friend.friends.includes(userId)) {
            friend.friends.push(userId);
            await friend.save();
        }

        return { message: 'Friend request sent successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
}

export default sendFriendRequest;
