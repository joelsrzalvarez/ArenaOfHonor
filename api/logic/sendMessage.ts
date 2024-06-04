import { Chat } from '../data/index';
import { validate, errors } from 'com';

const { SystemError, NotFoundError } = errors;

async function sendMessage(senderId, recipientId, text) {
    validate.text(senderId, 'senderId');
    validate.text(recipientId, 'recipientId');
    validate.text(text, 'text');

    try {
        let chat = await Chat.findOne({ participants: { $all: [senderId, recipientId] } });

        if (!chat) {
            chat = new Chat({
                participants: [senderId, recipientId],
                messages: []
            });
        }

        chat.messages.push({ sender: senderId, receiver: recipientId, text, sentAt: new Date() });
        await chat.save();

        return { message: 'Message sent successfully' };
    } catch (error) {
        throw new SystemError(error.message);
    }
}

export default sendMessage;
