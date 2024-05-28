import { Schema } from 'mongoose';

const { Types: { ObjectId } } = Schema;

import { User } from '../data/index.ts';

import { validate, errors } from 'com';

const { NotFoundError, SystemError } = errors;

function retrieveUser(userId: string, targetUserId: string): Promise<{ name: string, email: string, honor_points: number, arena_points: number, inventory: Array<{ itemId: string, name: string, quantity: number }> }> {
    validate.text(userId, 'userId', true);
    validate.text(targetUserId, 'targetUserId', true);

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message); })
        .then(user => {
            if (!user) throw new NotFoundError('user not found');

            return User.findById(targetUserId).select('-_id name email honor_points arena_points inventory').lean();
        })
        .then(user => {
            if (!user) throw new NotFoundError('target user not found');

            const inventory = user.inventory.map(item => ({
                itemId: item.itemId.toString(),
                name: item.name,
                quantity: item.quantity
            }));

            return {
                name: user.name,
                email: user.email,
                honor_points: user.honor_points,
                arena_points: user.arena_points,
                inventory: inventory
            };
        });
}

export default retrieveUser;
