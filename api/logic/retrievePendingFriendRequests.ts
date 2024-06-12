import { User } from '../data/index';

async function retrievePendingFriendRequests(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const pendingFriendRequests = await User.find({
            _id: { $in: user.pendingFriendRequests }
        }, 'username _id');

        return pendingFriendRequests.map(request => ({
            senderId: request._id,
            username: request.username
        }));
    } catch (error) {
        throw new Error(error.message);
    }
}

export default retrievePendingFriendRequests;
