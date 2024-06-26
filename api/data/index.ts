import mongoose, { Schema, model, Document } from 'mongoose';

type UserType = {
    name: string;
    surname: string;
    username: string; 
    email: string;
    password: string;
    honor_points: number;
    arena_points: number;
    inventory: Array<InventoryItemType>;
    vip: boolean;
    avatar: string;
    friends: mongoose.Types.ObjectId[];
    pendingFriendRequests: mongoose.Types.ObjectId[];
    status: 'online' | 'offline';
};

type InventoryItemType = {
    itemId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
};

type CreateCharacterType = {
    name: string;
    clase: string;
    win_streak: number;
    max_win_streak: number;
    user_id: mongoose.Types.ObjectId;
};

type CreateShopType = {
    name: string;
    price: number;
    type: string;
};

type CreateRoomType = {
    idHost: mongoose.Types.ObjectId;
    idGuest: mongoose.Types.ObjectId;
    startedAt: Date;
    endedAt: Date;
    winner: mongoose.Types.ObjectId;
    division: string;
    finished: boolean;
};

type ChatType = {
    participants: mongoose.Types.ObjectId[];
    messages: {
        sender: mongoose.Types.ObjectId;
        receiver: mongoose.Types.ObjectId;
        text: string;
        sentAt: Date;
    }[];
};

interface Chat extends Document {
    participants: mongoose.Types.ObjectId[];
    messages: {
        sender: mongoose.Types.ObjectId;
        receiver: mongoose.Types.ObjectId;
        text: string;
        sentAt: Date;
    }[];
}

interface Character extends Document {
    name: string;
    clase: string;
    win_streak: number;
    max_win_streak: number;
    honor_points: number;
    arena_points: number;
    user_id: mongoose.Types.ObjectId;
}

interface Shop extends Document {
    name: string;
    price: number;
    type: string;
}

interface RoomDocument extends Document {
    idHost: mongoose.Types.ObjectId;
    idGuest: mongoose.Types.ObjectId;
    startedAt: Date;
    endedAt: Date;
    winner: mongoose.Types.ObjectId;
    division: string;
    finished: boolean;
}

interface InventoryItem extends Document {
    itemId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
}

const inventoryItemSchema = new Schema<InventoryItemType>({
    itemId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const userSchema = new Schema<UserType>({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: { 
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    honor_points: {
        type: Number,
        required: true
    },
    arena_points: {
        type: Number,
        required: true
    },
    inventory: [inventoryItemSchema],
    vip: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: '',
        required: true
    },
    friends: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    pendingFriendRequests: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    }
});

const createCharacterSchema = new Schema<CreateCharacterType>({
    name: {
        type: String,
        required: true
    },
    clase: {
        type: String,
        required: true
    },
    win_streak: {
        type: Number,
        required: true
    },
    max_win_streak: {
        type: Number,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
});

const shopSchema = new Schema<Shop>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['arena_points', 'honor_points']
    }
});

const roomSchema = new Schema<RoomDocument>({
    idHost: {
        type: Schema.Types.ObjectId,
        ref: 'Character',
        required: true
    },
    idGuest: {
        type: Schema.Types.ObjectId,
        ref: 'Character',
        required: false
    },
    startedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    endedAt: {
        type: Date,
        required: false
    },
    winner: {
        type: Schema.Types.ObjectId,
        required: false
    },
    division: {
        type: String,
        required: true,
        enum: ['bronze', 'silver', 'gold', 'platinum', 'emerald', 'diamond', 'master', 'grandmaster', 'challenger']
    },
    finished: {
        type: Boolean,
        required: true,
        default: false
    }
});

const chatSchema = new Schema<ChatType>({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    messages: [{
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        sentAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }]
});

const User = model<UserType & Document>('User', userSchema);
const Character = model<Character & Document>('Character', createCharacterSchema);
const Shop = model<Shop & Document>('Shop', shopSchema);
const RoomModel = model<RoomDocument & Document>('Room', roomSchema);
const Chat = model<ChatType & Document>('Chat', chatSchema);

export {
    UserType,
    User,
    InventoryItemType,
    InventoryItem,
    CreateCharacterType,
    Character,
    CreateShopType,
    Shop,
    CreateRoomType,
    RoomModel,
    ChatType,
    Chat
};
