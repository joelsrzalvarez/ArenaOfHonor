import { User } from '../data/index';

async function retrievePendingFriendRequests(userId) {
    try {
        const user = await User.findById(userId).populate('pendingFriendRequests', '_id');
        if (!user) {
            throw new Error('User not found');
        }
        return user.pendingFriendRequests.map(request => ({
            senderId: request._id
        }));
    } catch (error) {
        throw new Error(error.message);
    }
}

export default retrievePendingFriendRequests;
