import mongoose, { ObjectId } from 'mongoose'

const { Schema, model } = mongoose

const { Types: { ObjectId } } = Schema

type UserType = {
    name: string
    birthdate: Date
    email: string
    username: string
    password: string
    honor_points: number
    arena_points: number
}


const user = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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
    }
})

const User = model<UserType>('User', user)

export {
    UserType,
    User
}