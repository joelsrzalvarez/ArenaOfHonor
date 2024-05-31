import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import logic from './logic/index.ts';
import { errors } from 'com';
import jwt  from 'jsonwebtoken';
import cors from 'cors';
import tracer from 'tracer';
import colors from 'colors';

dotenv.config()

const { TokenExpiredError } = jwt
const { MONGODB_URL, PORT, JWT_SECRET, JWT_EXP } = process.env

const logger = tracer.colorConsole({
    filters: {
        debug: colors.green,
        info: colors.blue,
        warn: colors.yellow,
        error: colors.red
    }
})

const {
    ContentError,
    SystemError,
    DuplicityError,
    NotFoundError,
    CredentialsError,
    UnauthorizedError
} = errors

mongoose.connect(MONGODB_URL)
.then(() => {
    const api = express();
    const server = http.createServer(api);
    const io = new SocketServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });
    const jsonBodyParser = express.json()

    api.use(cors());
    api.use(express.json());

    api.post('/users', jsonBodyParser, (req, res) => {
        try {
            const { name, surname, email, password, honor_points, arena_points, vip, avatar } = req.body

            logic.registerUser(name, surname, email, password, honor_points, arena_points, vip, avatar)
                .then(() => res.status(201).send())
                .catch(error => {
                    if (error instanceof SystemError) {
                        logger.error(error.message)

                        res.status(500).json({ error: error.constructor.name, message: error.message })
                    } else if (error instanceof DuplicityError) {
                        logger.warn(error.message)

                        res.status(409).json({ error: error.constructor.name, message: error.message })
                    }
                })
        } catch (error) {
            if (error instanceof TypeError || error instanceof ContentError) {
                logger.warn(error.message)

                res.status(406).json({ error: error.constructor.name, message: error.message })
            } else {
                logger.warn(error.message)

                res.status(500).json({ error: SystemError.name, message: error.message })
            }
        }
    });

    api.put('/users/:userId/updatePassword', jsonBodyParser, async (req, res) => {
        const { userId } = req.params;
        const { password } = req.body;
        try {
            await logic.updateUserPassword(userId, password);
            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                console.warn(error.message);
                res.status(404).json({ error: error.constructor.name, message: error.message });
            } else {
                console.error('Unexpected error occurred', error.message);
                res.status(500).json({ error: SystemError.name, message: 'An unexpected error occurred' });
            }
        }
    });
    
    api.post('/characters', jsonBodyParser, async (req, res) => {
        const { name, clase, win_streak, max_win_streak, user_id, page } = req.body;
        
        try {
            await logic.createCharacter(name, clase, win_streak, max_win_streak, user_id);
            res.status(201).json({ message: 'Character created successfully' });
            
        } catch (error) {
            if (error instanceof SystemError) {
            logger.error(error.message);
            res.status(500).json({ error: error.constructor.name, message: error.message });
            } 
            else if (error instanceof DuplicityError) {
            logger.warn(error.message);
            res.status(409).json({ error: error.constructor.name, message: error.message });
            } 
            else {
            logger.error(error.message);
            res.status(500).json({ error: SystemError.name, message: error.message });
            }
        }
    });
        
    
    api.post('/users/auth', jsonBodyParser, (req, res) => {
        try {
            const { email, password } = req.body

            logic.authenticateUser(email, password)
                .then(userId => {
                    const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXP })

                    res.json(token)
                })
                .catch(error => {
                    if (error instanceof SystemError) {
                        logger.error(error.message)

                        res.status(500).json({ error: error.constructor.name, message: error.message })
                    } else if (error instanceof CredentialsError) {
                        logger.warn(error.message)

                        res.status(401).json({ error: error.constructor.name, message: error.message })
                    } else if (error instanceof NotFoundError) {
                        logger.warn(error.message)

                        res.status(404).json({ error: error.constructor.name, message: error.message })
                    }
                })
        } catch (error) {
            if (error instanceof TypeError || error instanceof ContentError) {
                logger.warn(error.message)

                res.status(406).json({ error: error.constructor.name, message: error.message })
            } else {
                logger.warn(error.message)

                res.status(500).json({ error: SystemError.name, message: error.message })
            }
        }
    })

    api.post('/shop/buyArenaPoints', async (req, res) => {
        const { userId, quantity } = req.body;
    
        try {
            const newArenaPoints = await logic.buyArenaPoints(userId, quantity);
            res.status(200).json({ message: 'Arena points purchased successfully', arena_points: newArenaPoints });
        } catch (error) {
            console.error('Error purchasing arena points:', error);
            res.status(500).json({ message: error.message });
        }
    });

    api.get('/users/:targetUserId', (req, res) => {
        try {
            const { authorization } = req.headers

            const token = authorization.slice(7)

            const { sub: userId } = jwt.verify(token, JWT_SECRET)

            const { targetUserId } = req.params

            logic.retrieveUser(userId as string, targetUserId)
                .then(user => res.json(user))
                .catch(error => {
                    if (error instanceof SystemError) {
                        logger.error(error.message)

                        res.status(500).json({ error: error.constructor.name, message: error.message })
                    } else if (error instanceof NotFoundError) {
                        logger.warn(error.message)

                        res.status(404).json({ error: error.constructor.name, message: error.message })
                    }
                })
        } catch (error) {
            if (error instanceof TypeError || error instanceof ContentError) {
                logger.warn(error.message)

                res.status(406).json({ error: error.constructor.name, message: error.message })
            } else if (error instanceof TokenExpiredError) {
                logger.warn(error.message)

                res.status(498).json({ error: UnauthorizedError.name, message: 'session expired' })
            } else {
                logger.warn(error.message)

                res.status(500).json({ error: SystemError.name, message: error.message })
            }
        }
    })

    api.delete('/characters/:id', jsonBodyParser, async (req, res) => {
        const { id } = req.params;
    
        try {
            await logic.deleteCharacter(id);
            res.status(200).json({ message: 'Character deleted successfully' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                logger.warn(error.message);
                res.status(404).json({ error: error.constructor.name, message: error.message });
            } else {
                logger.error('Unexpected error occurred', error.message);
                res.status(500).json({ error: SystemError.name, message: 'An unexpected error occurred' });
            }
        }
    });

    api.put('/characters/:playerId/:loserId/updateWins', async (req, res) => {
        const { playerId, loserId } = req.params;
    
        try {
            await logic.updateWins(playerId, loserId);
            res.status(200).json({ message: 'Win streak updated successfully' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                logger.warn(error.message);
                res.status(404).json({ error: error.constructor.name, message: error.message });
            } else {
                logger.error('Unexpected error occurred', error.message);
                res.status(500).json({ error: SystemError.name, message: 'An unexpected error occurred' });
            }
        }
    });
    

    api.get('/characters/ranking', async (req, res) => {
        try {
          const characters = await logic.retrieveRanking(); 
          res.status(200).json(characters);
        } catch (error) {
          res.status(500).json({ message: 'Error retrieving characters', error });
        }
    });

    api.get('/shop', async (req, res) => {
        try {
            const shop = await logic.retrieveShop();
            res.status(200).json(shop);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving shop', error: error.message });
        }
    });

    api.post('/shop/buy', async (req, res) => {
        const { userId, itemId } = req.body;
        try {
            await logic.buyItem(userId, itemId);
            res.status(200).json({ message: 'Item purchased successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    api.get('/characters', async (req, res) => {
        const { userId } = req.query;
        try {
            const characters = await logic.retrieveCharacter(userId);
            res.status(200).json(characters);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.constructor.name, message: error.message });
            } else {
                res.status(500).json({ error: SystemError.name, message: error.message });
            }
        }
    });

    api.get('/characters/elo', jsonBodyParser, async (req, res) => {
        const { userId } = req.query;
    
        try {
            const elos = await logic.getEloFromCharacter(userId);
            res.status(200).json(elos);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.constructor.name, message: error.message });
            } else {
                res.status(500).json({ error: SystemError.name, message: 'An unexpected error occurred' });
            }
        }
    });

    api.get('/users/email/:email', jsonBodyParser, async (req, res) => {
        const { email } = req.params;
    
        try {
            const userId = await logic.getEmailFriendRequest(email);
            console.log(userId)
            res.status(200).json({userId});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    
    api.post('/friends/request', jsonBodyParser, async (req, res) => {
        const { userId, friendId } = req.body;
    
        try {
            const result = await logic.sendFriendRequest(userId, friendId);
            res.status(200).json({result});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    

    io.on('connection', (socket) => {    
        socket.on('findMatch', ({ id, skin, name }) => {
            logic.handleMatchMaking(io, socket, { idPlayer: id, skin: skin, name: name });
        });
    
        socket.on('cancelMatch', (data) => {
            console.log(`${data.id} quiere cancelar la partida`)
            logic.handleCancelMatchMaking(socket, data);
        });
    
        socket.on('disconnect', () => {
            logger.info(`User ${socket.id} has disconnected`);
        });
    });    
    
    server.listen(PORT, () => logger.info(`API listening on port ${PORT}`));
    
})
.catch(error => logger.error(error))


