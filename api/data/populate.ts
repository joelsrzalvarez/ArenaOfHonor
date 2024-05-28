import mongoose from 'mongoose'

import { Shop } from './index.ts'


mongoose.connect('mongodb://localhost:27017/arenaofhonor')
    .then(() => Shop.create({name: 'Sword Shop',price: 1000,type: ['arena_points', 'honor_points']})
    
    .then(() => mongoose.disconnect())
    .then(() => console.log('populated'))
    .catch(console.error))