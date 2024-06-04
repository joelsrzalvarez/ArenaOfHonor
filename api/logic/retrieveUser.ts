import { Schema } from 'mongoose';

const { Types: { ObjectId } } = Schema;

import { User } from '../data/index.ts';

import { validate, errors } from 'com';

const { NotFoundError, SystemError } = errors;

async function retrieveUser(userId, targetUserId) {
    validate.text(userId, 'userId', true);
    validate.text(targetUserId, 'targetUserId', true);

    try {
        const user = await User.findById(userId);
        if (!user) throw new NotFoundError('user not found');

        const targetUser = await User.findById(targetUserId).select('name password email honor_points arena_points avatar inventory').lean();
        if (!targetUser) throw new NotFoundError('target user not found');

        const inventory = targetUser.inventory.map(item => ({
            itemId: item.itemId.toString(),
            name: item.name,
            quantity: item.quantity
        }));

        const result = {
            _id: targetUser._id.toString(),
            name: targetUser.name,
            password: targetUser.password,
            email: targetUser.email,
            honor_points: targetUser.honor_points,
            arena_points: targetUser.arena_points,
            avatar: targetUser.avatar,
            inventory: inventory,
        };
        return result;
    } catch (error) {
        console.error('Error in retrieveUser:', error);
        throw new SystemError(error.message);
    }
}

export default retrieveUser;
