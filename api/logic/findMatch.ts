import { Server, Socket } from "socket.io";

interface Player {
  id: string;
  socket: Socket;
  name: string;
  health: number;
  skin: string;
}

interface Room {
  id: string;
  players: Player[];
  timerId?: NodeJS.Timeout;
  gameEnded: boolean;
}

const rooms: Room[] = [];
const MAX_PLAYERS_PER_ROOM = 2;

export const handleMatchMaking = (io: Server, socket: Socket, { idPlayer, skin, name }): void => {
    let availableRoom = rooms.find(room => room.players.length < MAX_PLAYERS_PER_ROOM && !room.gameEnded);

    if (availableRoom) {
        addPlayerToRoom(availableRoom, { id: idPlayer, socket, name, health: 100, skin });
        if (availableRoom.players.length === MAX_PLAYERS_PER_ROOM) {
            startMatch(io, availableRoom);
        }
    } else {
        createNewRoom({ id: idPlayer, socket, name, health: 100, skin });
    }
};

export const handleCancelMatchMaking = (socket: Socket, { id }: { id: string }): void => {
    const room = rooms.find(room => room.players.some(player => player.id === id && room.players.length < MAX_PLAYERS_PER_ROOM && !room.gameEnded));
    
    if (room) {
        removePlayerFromRoom(room, id);
    }
};

const addPlayerToRoom = (room: Room, player: Player): void => {
    room.players.push(player);
};

const createNewRoom = (player: Player): void => {
    const newRoomId = `room_${Math.floor(Math.random() * 100000) + 1}`;
    const newRoom: Room = { id: newRoomId, players: [player], gameEnded: false };
    rooms.push(newRoom);
    console.log(`New room created with ID ${newRoomId}`);
};

const startMatch = (io: Server, room: Room): void => {
    io.emit('start', {
        roomId: room.id,
        players: room.players.map(player => player.id),
        names: room.players.map(player => player.name),
        skins: room.players.map(player => player.skin),
        message: `Match found in room ${room.id}`
    });

    startGame(room);

    room.players.forEach(player => {
        setupPlayerEventHandlers(player, room);
    });
};

const setupPlayerEventHandlers = (player: Player, room: Room): void => {
    player.socket.on('moveBox', (data) => {
        const { playerId, direction, positionX } = data;
        player.socket.broadcast.emit('boxMoved', { playerId, direction, positionX });
    });

    player.socket.on('attack', ({ playerId, roomId, targetId }) => {
        handleAttack(room, playerId, roomId, targetId);
    });

    player.socket.on('startGame', (roomId) => {
        if (roomId === room.id) {
            startGame(room);
        }
    });

    player.socket.on('sendAttack', ({ playerId }) => {
        player.socket.broadcast.emit('playerAttack', { playerId });
    });

    player.socket.on('sendHit', ({ playerId }) => {
        player.socket.broadcast.emit('playerHit', { playerId });
    });

    player.socket.on('winner', ({ playerId, targetId }) => {
        player.socket.broadcast.emit('congratsWinner', { targetId });
        clearInterval(room.timerId);
        endGame(room);
    });

    player.socket.on('sendJump', ({ targetId }) => {
        player.socket.broadcast.emit('jump', { targetId });
    });

    player.socket.on('disconnect', () => {
        handlePlayerDisconnect(room, player);
    });
};

const handleAttack = (room: Room, playerId: string, roomId: string, targetId: string): void => {
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
                room.players.forEach(player => {
                    player.socket.broadcast.emit('playerDied', { playerId, targetId: target.id });
                });
                room.gameEnded = true;
                clearInterval(room.timerId);
                endGame(room);
            } else {
                room.players.forEach(player => {
                    player.socket.broadcast.emit('playerAttacked', { playerId: targetId, health: target.health });
                });
            }
        }
    }
};


const removePlayerFromRoom = (room: Room, playerId: string): void => {
    room.players = room.players.filter(player => player.id !== playerId);
    if (room.players.length === 0) {
        rooms.splice(rooms.indexOf(room), 1);
        console.log(`Room ${room.id} deleted because player ${playerId} canceled the match.`);
    }
};

const handlePlayerDisconnect = (room: Room, player: Player): void => {
    if (!room.gameEnded) {
        removePlayerFromRoom(room, player.id);
        if (room.players.length === 0) {
            clearInterval(room.timerId);
            rooms.splice(rooms.indexOf(room), 1);
            console.log(`Room ${room.id} deleted because all players disconnected.`);
        } else {
            room.players.forEach(p => {
                p.socket.emit('opponentDisconnected', { playerId: player.id });
            });
        }
    }
};

const startGame = (room: Room): void => {
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
            endGame(room);
        }
    }, 1000);
};

const endGame = (room: Room): void => {
    room.players.forEach(player => {
        player.socket.emit('gameEnded', { roomId: room.id });
    });
    rooms.splice(rooms.indexOf(room), 1);
    console.log(`Room ${room.id} ended and deleted.`);
};
