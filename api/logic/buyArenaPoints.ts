import { User, Shop } from '../data/index.ts';
import { SystemError, NotFoundError } from 'com/errors';

async function buyArenaPoints(userId, quantity) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    user.arena_points += quantity;
    await user.save();

    return user.arena_points;
}

export default buyArenaPoints;
