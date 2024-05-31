import { User, Shop } from '../data/index.ts';
import { SystemError, NotFoundError } from 'com/errors';

async function buyItem(userId, itemId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError(`User with ID ${userId} not found`);
        }

        const item = await Shop.findById(itemId);
        if (!item) {
            throw new NotFoundError(`Item with ID ${itemId} not found`);
        }

        if (item.type === 'honor_points') {
            if (user.honor_points < item.price) {
                throw new SystemError('Not enough honor points');
            }
            user.honor_points -= item.price;
        } else if (item.type === 'arena_points') {
            if (user.arena_points < item.price) {
                throw new SystemError('Not enough arena points');
            }
            user.arena_points -= item.price;
        }

        const inventoryItem = user.inventory.find(i => i.itemId.equals(item._id));
        if (inventoryItem) {
            inventoryItem.quantity += 1;
        } else {
            user.inventory.push({
                itemId: item._id,
                name: item.name,
                quantity: 1
            });
        }

        await user.save();
    } catch (error) {
        throw new SystemError(error.message);
    }
}

export default buyItem;
