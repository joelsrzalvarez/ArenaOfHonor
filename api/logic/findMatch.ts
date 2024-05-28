import mongoose from 'mongoose';
import { Server, Socket } from 'socket.io';
import { RoomModel } from '../data/index'; 

interface Player {
  id: string;
  socket: Socket;
  name: string;
  health: number;
  skin: string;
}

interface GameRoom {
  id: string;
  players: Player[];
  timerId?: NodeJS.Timeout;
  gameEnded: boolean;
  winner?: string;
}

const rooms: GameRoom[] = [];
const MAX_PLAYERS_PER_ROOM = 2;

export const handleMatchMaking = async (io: Server, socket: Socket, { idPlayer, skin, name }): Promise<void> => {
    console.log(`Player ${idPlayer} is looking for a match`);
    const roomWithPlayers = rooms.find(room => room.players.length > 0);
    if (roomWithPlayers) {
        console.log('Jugadores en la room:', JSON.stringify(roomWithPlayers.players.map(({ id, name, health, skin }) => ({
            id, name, health, skin
        })), null, 2));
    } else {
        console.log('No se encontraron rooms con jugadores.');
    }

    let availableRoom = rooms.find(room => room.players.length < MAX_PLAYERS_PER_ROOM && !room.gameEnded);
    console.log('AVAILABLE ROOM IS:', availableRoom ? JSON.stringify({
        id: availableRoom.id,
        players: availableRoom.players.map(({ id, name, health, skin }) => ({
            id, name, health, skin
        })),
        gameEnded: availableRoom.gameEnded,
        winner: availableRoom.winner
    }, null, 2) : 'None');

    if (availableRoom) {
        const isPlayerAlreadyInRoom = availableRoom.players.some(player => player.id === idPlayer);
        console.log(`Is player already in room: ${isPlayerAlreadyInRoom}`);
        if (!isPlayerAlreadyInRoom) {
            addPlayerToRoom(availableRoom, { id: idPlayer, socket, name, health: 100, skin });
            console.log(`Player ${idPlayer} added to room ${availableRoom.id}`);
            console.log('Jugadores en la room:', JSON.stringify(availableRoom.players.map(({ id, name, health, skin }) => ({
                id, name, health, skin
            })), null, 2));

            if (availableRoom.players.length === MAX_PLAYERS_PER_ROOM) {
                const guest = availableRoom.players[1];
                const roomDocument = await RoomModel.findById(availableRoom.id);
                if (roomDocument) {
                    roomDocument.idGuest = new mongoose.Types.ObjectId(guest.id);
                    await roomDocument.save();
                    console.log(`Room ${availableRoom.id} updated with guest ${guest.id}`);
                }
                startMatch(io, availableRoom);
            }
        } else {
            console.log(`Player ${idPlayer} is already in room ${availableRoom.id}`);
        }
    } else {
        console.log(`No available room found, creating a new room for player ${idPlayer}`);
        const division = 'bronze';
        const newRoom = await createNewRoom({ id: idPlayer, socket, name, health: 100, skin }, division);
        rooms.push(newRoom);
        console.log(`New room ${newRoom.id} created for player ${idPlayer}`);
        console.log('Jugadores en la nueva room:', JSON.stringify(newRoom.players.map(({ id, name, health, skin }) => ({
            id, name, health, skin
        })), null, 2));
    }
};

export const handleCancelMatchMaking = async (socket: Socket, { id }: { id: string }): Promise<void> => {
    const room = rooms.find(room => room.players.some(player => player.id === id && room.players.length < MAX_PLAYERS_PER_ROOM && !room.gameEnded));

    if (room) {
        await removePlayerFromRoom(room, id);
    }
};

const addPlayerToRoom = (room: GameRoom, player: Player): void => {
    room.players.push(player);
    console.log(`Player ${player.id} added to room ${room.id}`);
    player.socket.join(room.id);  // Join the room in Socket.IO
};

const createNewRoom = async (player: Player, division: string): Promise<GameRoom> => {
    const newRoom = new RoomModel({
        idHost: new mongoose.Types.ObjectId(player.id),
        division,
        finished: false
    });
    await newRoom.save();
    console.log(`New room created with ID ${newRoom._id}`);
    return {
        id: newRoom._id.toString(),
        players: [player],
        gameEnded: false
    };
};

const startMatch = (io: Server, room: GameRoom): void => {
    io.to(room.id).emit('start', {
        roomId: room.id,
        players: room.players.map(player => player.id),
        names: room.players.map(player => player.name),
        skins: room.players.map(player => player.skin),
        message: `Match found in room ${room.id}`
    });

    startGame(io, room);

    room.players.forEach(player => {
        setupPlayerEventHandlers(io, player, room);
    });
};

const setupPlayerEventHandlers = (io: Server, player: Player, room: GameRoom): void => {
    player.socket.on('moveBox', (data) => {
        const { playerId, direction, positionX } = data;
        io.to(room.id).emit('boxMoved', { playerId, direction, positionX });
    });

    player.socket.on('attack', ({ playerId, roomId, targetId }) => {
        handleAttack(io, room, playerId, roomId, targetId);
    });

    player.socket.on('startGame', (roomId) => {
        if (roomId === room.id) {
            startGame(io, room);
        }
    });

    player.socket.on('sendAttack', ({ playerId }) => {
        io.to(room.id).emit('playerAttack', { playerId });
    });

    player.socket.on('sendHit', ({ playerId }) => {
        io.to(room.id).emit('playerHit', { playerId });
    });

    player.socket.on('winner', async ({ playerId }) => {
        room.winner = playerId;
        console.log(room.winner)
        clearInterval(room.timerId);
        await endGame(io, room);
    });

    player.socket.on('sendJump', ({ targetId }) => {
        io.to(room.id).emit('jump', { targetId });
    });

    player.socket.on('disconnect', () => {
        handlePlayerDisconnect(io, room, player);
    });
};

const handleAttack = (io: Server, room: GameRoom, playerId: string, roomId: string, targetId: string): void => {
    if (room.id === roomId && !room.gameEnded) {
        const target = room.players.find(player => player.id === targetId);
        if (target) {
            target.health -= 10;
            room.players.forEach(player => {
                player.socket.emit('lifeBar', {
                    playerId,
                    idHost: room.players[0].id,
                    hostHealth: room.players[0].health,
                    idGuest: room.players[1].id,
                    guestHealth: room.players[1].health
                });
            });

            if (target.health <= 0) {
                io.to(room.id).emit('playerDied', { playerId, targetId: target.id });
                room.winner = playerId;
                room.gameEnded = true;
                clearInterval(room.timerId);
                endGame(io, room);
            } else {
                io.to(room.id).emit('playerAttacked', { playerId: targetId, health: target.health });
            }
        }
    }
};

const removePlayerFromRoom = async (room: GameRoom, playerId: string): Promise<void> => {
    room.players = room.players.filter(player => player.id !== playerId);
    if (room.players.length === 0) {
        rooms.splice(rooms.indexOf(room), 1);
        console.log(`Room ${room.id} deleted because player ${playerId} canceled the match.`);
        await RoomModel.findByIdAndDelete(room.id);
    }
};

const handlePlayerDisconnect = async (io: Server, room: GameRoom, player: Player): Promise<void> => {
    if (room.players.length === 0) {
        clearInterval(room.timerId);
    } else {
        const roomDocument = await RoomModel.findById(room.id);
        if (roomDocument) {
            roomDocument.finished = true;
            roomDocument.endedAt = new Date();
            roomDocument.winner = new mongoose.Types.ObjectId(room.winner);
            await roomDocument.save();
        }
        room.players.forEach(p => {
            p.socket.emit('opponentDisconnected', { playerId: player.id });
        });
    }
};

const startGame = (io: Server, room: GameRoom): void => {
    let timeLeft = 60;
    room.timerId = setInterval(() => {
        timeLeft--;
        room.players.forEach(player => {
            player.socket.emit('timer', { timeLeft });
        });
        if (timeLeft <= 0) {
            clearInterval(room.timerId);
            room.players.forEach(player => {
                player.socket.emit('timeUp', { message: 'Time is up!' });
            });
            room.gameEnded = true;
            endGame(io, room); // Asegúrate de pasar ambos argumentos aquí
        }
    }, 1000);
};


const endGame = async (io: Server, room: GameRoom): Promise<void> => {
    room.players.forEach(player => {
        player.socket.emit('gameEnded', { roomId: room.id, winner: room.winner });
    });
    const roomDocument = await RoomModel.findById(room.id);
    if (roomDocument) {
        roomDocument.finished = true;
        roomDocument.endedAt = new Date();
        roomDocument.winner = new mongoose.Types.ObjectId(room.winner);
        await roomDocument.save();
    }
    rooms.splice(rooms.indexOf(room), 1);
    console.log(`Room ${room.id} ended and deleted.`);
};
