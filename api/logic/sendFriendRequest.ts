import { User } from '../data/index';

async function sendFriendRequest(userId, friendId) {
    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            throw new Error('User not found');
        }

        if (!user.friends) {
            user.friends = [];
        }
        if (!friend.friends) {
            friend.friends = [];
        }
        if (!friend.pendingFriendRequests) {
            friend.pendingFriendRequests = [];
        }

        if (!friend.pendingFriendRequests.includes(userId)) {
            friend.pendingFriendRequests.push(userId);
            await friend.save();
        }

        return { message: 'Friend request sent successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
}

export default sendFriendRequest;
