import { Chat } from '../data/index';
import { validate, errors } from 'com';

const { NotFoundError, SystemError } = errors;

async function retrieveMessages(senderId, recipientId) {
    validate.text(senderId, 'senderId', true);
    validate.text(recipientId, 'recipientId', true);

    try {
        let chat = await Chat.findOne({ participants: { $all: [senderId, recipientId] } });

        if (!chat) {
            chat = new Chat({
                participants: [senderId, recipientId],
                messages: []
            });
            await chat.save();
        }

        return chat.messages;
    } catch (error) {
        throw new SystemError(error.message);
    }
}

export default retrieveMessages;
