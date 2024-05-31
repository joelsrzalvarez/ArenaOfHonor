import { User } from '../data/index.ts';

async function acceptFriendRequest(userId, friendId) {
    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            throw new Error('User not found');
        }

        user.pendingFriendRequests = user.pendingFriendRequests.filter(id => !id.equals(friendId));

        if (!user.friends.includes(friendId)) {
            user.friends.push(friendId);
        }
        if (!friend.friends.includes(userId)) {
            friend.friends.push(userId);
        }

        await user.save();
        await friend.save();

        return { message: 'Friend request accepted successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
}

async function rejectFriendRequest(userId, friendId) {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        user.pendingFriendRequests = user.pendingFriendRequests.filter(id => !id.equals(friendId));

        await user.save();

        return { message: 'Friend request rejected successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
}

export { acceptFriendRequest, rejectFriendRequest };
