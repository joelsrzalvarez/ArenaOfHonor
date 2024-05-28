import React, { useEffect, useState, useRef } from 'react';
import { useLayout } from '../../LayoutContext';
import styles from './Game.module.css';
import { useNavigate } from 'react-router-dom';
import Fighter from './Fighter';
import logic from '../../logic';

function Game({ socket, roomId, characterIds, characters, players, playerNames, skins }) {
    const characterName = characters.map(char => char.name).join(', ');
    const currentPlayerId = characterIds.values().next().value;

    const skinHost = skins.host;
    const skinGuest = skins.guest;
    const nameHost = playerNames.host;
    const nameGuest = playerNames.guest;

    const idHost = players[0].toString();
    const idGuest = players[1].toString();
    const [posXHost, setPosXHost] = useState(80);
    const [posXGuest, setPosXGuest] = useState(800);
    const [timer, setTimer] = useState(60);
    const [hostHealth, setHostHealth] = useState(100);  
    const [guestHealth, setGuestHealth] = useState(100); 

    const [currentHostHealth, setCurrentHostHealth] = useState(100);
    const [currentGuestHealth, setCurrentGuestHealth] = useState(100); 

    const { setShowLayout } = useLayout();
    const navigate = useNavigate();

    const posXHostRef = useRef(posXHost);
    const posXGuestRef = useRef(posXGuest);

    const hostRef = useRef(null);
    const guestRef = useRef(null);

    const keysPressed = useRef({});

    useEffect(() => {
        setShowLayout(false);
        socket.emit('startGame', { roomId });

        const handleKeyDown = (event) => {
            keysPressed.current[event.key] = true;
            let newPosition;
            const isHost = currentPlayerId === idHost;
            const playerRef = isHost ? hostRef : guestRef;
            const setPosX = isHost ? setPosXHost : setPosXGuest;
            const posXRef = isHost ? posXHostRef : posXGuestRef;
            const targetId = isHost ? idGuest : idHost;
            const targetRef = isHost ? guestRef : hostRef;
    
            if (event.key === 'a') {
                newPosition = Math.max(0, posXRef.current - 10);
                setPosX(newPosition);
                if (playerRef.current) {
                    playerRef.current.handleAction('move');
                }
                socket.emit('moveBox', { playerId: currentPlayerId, direction: 'left', positionX: newPosition });
            } else if (event.key === 'd') {
                newPosition = posXRef.current + 10;
                setPosX(newPosition);
                if (playerRef.current) {
                    playerRef.current.handleAction('move');
                }
                socket.emit('moveBox', { playerId: currentPlayerId, direction: 'right', positionX: newPosition });
            } else if (event.key === 'w') { 
                if (playerRef.current) {
                    playerRef.current.handleAction('jump');
                    socket.emit('sendJump', { targetId });
                }
            } else if (event.key === ' ' || event.key === 'SPACE') {
                if (playerRef.current) {
                    playerRef.current.handleAction('attack');
                }
                socket.emit('sendAttack', { playerId: currentPlayerId });
                if (playerRef.current && targetRef.current && playerRef.current.isHitting(targetRef.current)) {
                    socket.emit('attack', { playerId: currentPlayerId, roomId, targetId });
                    socket.emit('sendHit', { playerId: currentPlayerId });
                    if (targetRef.current) {
                        targetRef.current.handleAction('hit');
                    }
                }
            }
        };

        const handleKeyUp = (event) => {
            keysPressed.current[event.key] = false;
            const playerRef = currentPlayerId === idHost ? hostRef : guestRef;
            if (event.key === 'a' || event.key === 'd') {
                if (playerRef.current) {
                    playerRef.current.stopMoving();
                }
            }
            if (playerRef.current && !keysPressed.current['a'] && !keysPressed.current['d']) {
                playerRef.current.handleAction('idle');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        socket.on('boxMoved', data => {
            const { playerId, positionX } = data;
            if (playerId === idHost) {
                setPosXHost(positionX);
                if (hostRef.current) {
                    hostRef.current.handleAction('move');
                }
            } else if (playerId === idGuest) {
                setPosXGuest(positionX);
                if (guestRef.current) {
                    guestRef.current.handleAction('move');
                }
            }
        });

        socket.on('timer', data => {
            const { timeLeft } = data;
            setTimer(timeLeft);
        });

        socket.on('timeUp', data => {
            const { message } = data;
            alert(message);
            window.location.href = 'http://localhost:5173/';
            setTimer(0);
        });

        socket.on('playerAttacked', data => {
            const { playerId, health } = data;
            if (playerId === idHost) {
                setCurrentHostHealth(health);
                setHostHealth(health * 4);
                if (hostRef.current) {
                    hostRef.current.handleAction('hit');
                }
                setTimeout(() => {
                    if (hostRef.current) {
                        hostRef.current.handleAction('idle');
                    }
                }, hostRef.current?.sprites?.takeHit?.maxFrames * hostRef.current?.holdFrames * 1000 / 60);
            } else if (playerId === idGuest) {
                setCurrentGuestHealth(health);
                setGuestHealth(health * 4); 
                if (guestRef.current) {
                    guestRef.current.handleAction('hit');
                }
                setTimeout(() => {
                    if (guestRef.current) {
                        guestRef.current.handleAction('idle');
                    }
                }, guestRef.current?.sprites?.takeHit?.maxFrames * guestRef.current?.holdFrames * 1000 / 60);
            }
        });

        socket.on('lifeBar', data => {
            const { playerId, idHost, hostHealth, idGuest, guestHealth } = data;
            if (currentPlayerId === idHost) {
                setCurrentGuestHealth(guestHealth);
                setGuestHealth(guestHealth * 4);
            } else if (currentPlayerId === idGuest) {
                setCurrentHostHealth(hostHealth);
                setHostHealth(hostHealth * 4); 
            }
        });

        socket.on('jump', data => {
            const { targetId } = data;
            if (targetId === idHost) {
                guestRef.current.handleAction('jump');
            }
            if (targetId === idGuest) {
                hostRef.current.handleAction('jump');
            } 
        });

        socket.on('playerAttack', data => {
            const { playerId } = data;
            if (playerId === idHost) {
                if (hostRef.current) {
                    hostRef.current.handleAction('attack');
                }
            } else if (playerId === idGuest) {
                if (guestRef.current) {
                    guestRef.current.handleAction('attack');
                }
            }
        });

        socket.on('playerHit', data => {
            const { playerId } = data;
            if (playerId === idHost) {
                if (guestRef.current) {
                    guestRef.current.handleAction('hit');
                }
            } else if (playerId === idGuest) {
                if (hostRef.current) {
                    hostRef.current.handleAction('hit');
                }
            }
        });

        socket.on('playerDied', data => {
            const { playerId, targetId } = data;
            if (playerId === idHost && targetId === idGuest) { // gana el host
                guestRef.current.handleAction('die');
                guestRef.current = null;
                socket.emit('winner', { playerId: idHost, targetId: idGuest });
                setTimeout(() => {
                    window.location.href = 'http://localhost:5173/';
                }, 5000);
            } else if (playerId === idGuest && targetId === idHost) { // gana el guest
                hostRef.current.handleAction('die');
                hostRef.current = null;
                socket.emit('winner', { playerId: idGuest, targetId: idHost });
                setTimeout(() => {
                    window.location.href = 'http://localhost:5173/';
                }, 5000);
            }
        });

        socket.on('congratsWinner', async data => {
            const { targetId } = data;
            try {
                if (currentPlayerId === idHost && targetId === idGuest) {
                    alert('Enhorabuena has ganado, sumas 1 victoria y 10 puntos de honor');
                    await logic.updateWins(idHost, idGuest);
                } else if (currentPlayerId === idGuest && targetId === idHost) {
                    alert('Enhorabuena has ganado, sumas 1 victoria y 10 puntos de honor');
                    await logic.updateWins(idGuest, idHost);
                }
            } catch (error) {
                console.error('Error updating win streak:', error);
            }
        });

        socket.on('opponentDisconnected', data => {
            const { playerId } = data;
            if (currentPlayerId === idHost && playerId === idGuest) {
                alert('Tu oponente se ha desconectado, sumas 1 victoria y 10 puntos de honor');
                guestRef.current = null;
                setTimeout(() => {
                    logic.updateWins(idHost, idGuest);
                    window.location.href = 'http://localhost:5173/';
                }, 5000);
            } else if (currentPlayerId === idGuest && playerId === idHost) {
                alert('Tu oponente se ha desconectado, sumas 1 victoria y 10 puntos de honor');
                hostRef.current = null;
                setTimeout(() => {
                    logic.updateWins(idGuest, idHost);
                    window.location.href = 'http://localhost:5173/';
                }, 5000);
            }
        });

        return () => {
            setShowLayout(true);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            socket.off('boxMoved');
            socket.off('timer');
            socket.off('timeUp');
            socket.off('playerAttacked');
            socket.off('lifeBar');
            socket.off('playerDied');
            socket.off('playerAttack');
            socket.off('playerHit');
            socket.off('congratsWinner');
            socket.off('opponentDisconnected');
        };
    }, [socket, roomId, idHost, idGuest, setShowLayout, characterIds, navigate, currentPlayerId]);

    useEffect(() => {
        posXHostRef.current = posXHost;
    }, [posXHost]);

    useEffect(() => {
        posXGuestRef.current = posXGuest;
    }, [posXGuest]);

    useEffect(() => {
        const canvas = document.getElementById('gameCanvas');
        const c = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const background = new Image();
        background.src = new URL('/assets/img/background.jpeg', import.meta.url).href;

        const host = new Fighter({
            name: "host",
            position: {
                x: 0,
                y: window.innerHeight - 200
            },
            offset: {
                x: 75,
                y: 0
            },
            imageSrc: `/assets/img/host/${skinHost}/Idle.png`,
            scale: 2.5,
            maxFrames: 8,
            holdFrames: 4,
            offsetFrame: { x: 215, y: 154 },
            sprites: { 
                idle: {
                    imageSrc: `/assets/img/host/${skinHost}/Idle.png`,
                    maxFrames: 8,
                },
                run: {
                    imageSrc: `/assets/img/host/${skinHost}/Run.png`,
                    maxFrames: 8,
                },
                jump: {
                    imageSrc: `/assets/img/host/${skinHost}/Jump.png`,
                    maxFrames: 2,
                },
                fall: {
                    imageSrc: `/assets/img/host/${skinHost}/Fall.png`,
                    maxFrames: 2,
                },
                death: {
                    imageSrc: `/assets/img/host/${skinHost}/Death.png`,
                    maxFrames: 6,
                },
                attack1: {
                    imageSrc: `/assets/img/host/${skinHost}/Attack1.png`,
                    maxFrames: 6,
                },
                takeHit: {
                    imageSrc: `/assets/img/host/${skinHost}/Takehit.png`,
                    maxFrames: 4,
                }
            },
            keys: {
                'a': {
                    pressed: false
                },
                'd': {
                    pressed: false
                },
                'w': {
                    pressed: false
                },
                ' ': {
                    pressed: false
                }
            },
            attackTime: 400
        });

        const guest = new Fighter({
            name: "guest",
            position: {
                x: 950,
                y: window.innerHeight - 200
            },
            offset: {
                x: -160,
                y: 0
            },
            imageSrc: `/assets/img/guest/${skinGuest}/Idle.png`,
            scale: 2.5,
            maxFrames: 4,
            holdFrames: 6,
            offsetFrame: { x: 215, y: 172 },
            sprites: {
                idle: {
                    imageSrc: `/assets/img/guest/${skinGuest}/Idle.png`,
                    maxFrames: 4,
                },
                run: {
                    imageSrc: `/assets/img/guest/${skinGuest}/Run.png`,
                    maxFrames: 8,
                },
                jump: {
                    imageSrc: `/assets/img/guest/${skinGuest}/Jump.png`,
                    maxFrames: 2,
                },
                fall: {
                    imageSrc: `/assets/img/guest/${skinGuest}/Fall.png`,
                    maxFrames: 2,
                },
                death: {
                    imageSrc: `/assets/img/guest/${skinGuest}/Death.png`,
                    maxFrames: 7,
                },
                attack1: {
                    imageSrc: `/assets/img/guest/${skinGuest}/Attack1.png`,
                    maxFrames: 4,
                },
                takeHit: {
                    imageSrc: `/assets/img/guest/${skinGuest}/Takehit.png`,
                    maxFrames: 3,
                }
            },
            keys: {
                'ArrowLeft': {
                    pressed: false
                },
                'ArrowRight': {
                    pressed: false
                },
                'ArrowUp': {
                    pressed: false
                },
                'Control': {
                    pressed: false
                }
            },
            attackTime: 350
        });

        hostRef.current = host;
        guestRef.current = guest;

        function animate() {
            c.clearRect(0, 0, canvas.width, canvas.height);
            if (background.complete) {
                c.drawImage(background, 0, 0, canvas.width, canvas.height);
            }
            if (hostRef.current) host.position.x = posXHost;
            if (guestRef.current) guest.position.x = posXGuest;
            if (hostRef.current) host.update(c);
            if (guestRef.current) guest.update(c);
            requestAnimationFrame(animate); // TODO: changes this to make sure you can play ok with every frame rate
        }
        background.onload = () => {
            animate();
        };
    }, [posXHost, posXGuest]);

    document.title = `${roomId} -- ${timer}`;

    return (
        <div className={styles.container}>
            <div id="hud" className={styles.hud}>
                <div style={{ width: '400px', height: '50px', border: '1px solid black', position: 'relative', backgroundColor: 'red' }}>
                    <div id="hostHealthLost" style={{ width: `${400 - (currentHostHealth * 4)}px`, height: '100%', backgroundColor: 'red', position: 'absolute', left: '0', top: '0' }}></div>
                    <div id="hostHealth" style={{ width: `${currentHostHealth * 4}px`, height: '100%', backgroundColor: 'green', position: 'absolute', left: '0', top: '0' }}>{nameHost}</div>
                </div>
                <div id="timer" className={styles.timer}>{timer}</div>
                <div style={{ width: '400px', height: '50px', border: '1px solid black', position: 'relative', backgroundColor: 'red' }}>
                    <div id="guestLostHealth" style={{ width: `${400 - (currentGuestHealth * 4)}px`, height: '100%', backgroundColor: 'red', position: 'absolute', left: '0', top: '0' }}></div>
                    <div id="guestHealth" style={{ width: `${currentGuestHealth * 4}px`, height: '100%', backgroundColor: 'green', position: 'absolute', left: '0', top: '0' }}>{nameGuest}</div>
                </div>
            </div>
            <canvas id="gameCanvas"></canvas>
        </div>
    );
}

export default Game;
