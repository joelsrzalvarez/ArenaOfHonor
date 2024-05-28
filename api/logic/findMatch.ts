import { Server, Socket } from "socket.io";

interface Room {
  id: string;
  players: { id: string, socket: Socket, name: string, health: number, skin: string }[];
  timerId?: NodeJS.Timeout;
  gameEnded: boolean;
}

const rooms: Room[] = [];
const maxPlayersPerRoom = 2;

export const handleMatchMaking = (io: Server, socket: Socket, { idPlayer, skin, name }): void => {
    let availableRoom = rooms.find(p => p.players.length < maxPlayersPerRoom);
    if (availableRoom) {
        availableRoom.players.push({ id: idPlayer, socket: socket, name: name, health: 100, skin: skin });

        if (availableRoom.players.length === maxPlayersPerRoom) {
            io.emit('start', {
                roomId: availableRoom.id,
                players: availableRoom.players.map(player => player.id),
                name: availableRoom.players.map(player => player.name),
                skins: availableRoom.players.map(player => player.skin),
                message: `Match found in room ${availableRoom.id}`
            });

            startGame(availableRoom);

            availableRoom.players.forEach(player => {
                player.socket.on('moveBox', (data) => {
                    const { playerId, direction, positionX } = data;
                    player.socket.broadcast.emit('boxMoved', { playerId, direction, positionX });
                });

                player.socket.on('attack', ({ playerId, roomId, targetId }) => {
                    const room = rooms.find(r => r.id === roomId);
                    if (room && !room.gameEnded) {
                        const target = room.players.find(p => p.id === targetId);
                        if (target) {
                            target.health -= 10;
                            player.socket.broadcast.emit('playerAttacked', { playerId: targetId, health: target.health });

                            const host = room.players.find(p => p.id === availableRoom.players[0].id);
                            const guest = room.players.find(p => p.id === availableRoom.players[1].id);
                            availableRoom.players.forEach(players => {
                                players.socket.emit('lifeBar', { playerId, idHost: host.id, hostHealth: host.health, idGuest: guest.id, guestHealth: guest.health });
                                if (target.health <= 0) {
                                    players.socket.broadcast.emit('playerDied', { playerId, targetId: target.id });
                                    room.gameEnded = true;
                                    clearInterval(availableRoom.timerId);
                                }    
                            });
                            player.socket.broadcast.emit('attack', { playerId });
                        }
                    }
                });

                player.socket.on('startGame', (roomId) => {
                    if (roomId === availableRoom.id) {
                        startGame(availableRoom);
                    }
                });

                player.socket.on('sendAttack', ({playerId}) => {
                    player.socket.broadcast.emit('playerAttack', { playerId});
                });

                player.socket.on('sendHit', ({playerId}) => {
                    player.socket.broadcast.emit('playerHit', { playerId});
                });

                player.socket.on('winner', ({playerId, targetId}) => {
                    player.socket.broadcast.emit('congratsWinner', {targetId});
                    clearInterval(availableRoom.timerId);
                });  

                player.socket.on('sendJump', ({targetId}) => {
                    player.socket.broadcast.emit('jump', { targetId});
                });

                player.socket.on('disconnect', () => {
                    if (!availableRoom.gameEnded) {
                        availableRoom.players = availableRoom.players.filter(p => p.id !== player.id);
                        if (availableRoom.players.length === 0) {
                            clearInterval(availableRoom.timerId);
                            rooms.splice(rooms.indexOf(availableRoom), 1);
                        } else {
                            availableRoom.players.forEach(p => {
                                p.socket.emit('opponentDisconnected', { playerId: player.id });
                            });
                        }
                    }
                });
            });
        }
    } else {
        const newRoomId = `room_${Math.floor(Math.random() * 100000) + 1}`;
        rooms.push({ id: newRoomId, players: [{ id: idPlayer, socket: socket, name: name, health: 100, skin: skin }], gameEnded: false });
    }
};

const startGame = (room: Room) => {
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
        }
    }, 1000);
};
