import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import CreateCharacterForm from '../components/CreateCharacterForm';
import ConfirmDialog from '../components/ConfirmDialog';
import retrieveCharacter from '../logic/retrieveCharacter';
import deleteCharacter from '../logic/deleteCharacter';
import retrieveUser from '../logic/retrieveUser';
import decryptToken from '../logic/decryptToken';
import getEloFromCharacter from '../logic/getEloFromCharacter';
import Game from '../components/Game/Game';
import Chat from '../components/Friends';

import './Home.css';
import Friends from '../components/Friends';

function Home() {
    const [characters, setCharacters] = useState([]);
    const [characterIds, setCharacterIds] = useState(new Set()); 
    const [selectedCharacterId, setSelectedCharacterId] = useState(null);
    const [roomId, setRoomId] = useState();
    const [showCreateCharacter, setShowCreateCharacter] = useState(false);
    const [searching, setSearching] = useState(false);
    const [socket, setSocket] = useState(null);
    const [gameFound, setGameFound] = useState(false);
    const [players, setPlayers] = useState([]);
    const [playerNames, setPlayerNames] = useState({ host: '', guest: '' });
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [skins, setSkins] = useState({});
    const [enabledSkinSelectors, setEnabledSkinSelectors] = useState({});
    const [eloImages, setEloImages] = useState({});
    const [eloClasses, setEloClasses] = useState({});
    const [divisions, setDivisions] = useState({ host: '', guest: '' });
    const [showChatModal, setShowChatModal] = useState(false);

    useEffect(() => {
        const newSocket = io('ws://localhost:9000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to the game');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from the game');
        });

        newSocket.on('start', (data) => {
            console.log('Match found:', data);
            if (data.players.some(playerId => characterIds.has(playerId))) {
                console.log('This client is part of the match');
                setRoomId(data.roomId);
                setPlayers(data.players);
                setGameFound(true);
    
                const [hostId, guestId] = data.players;
                const hostCharacter = characters.find(char => char._id === hostId);
                const guestCharacter = characters.find(char => char._id === guestId);
                setPlayerNames({ host: hostCharacter ? hostCharacter.name : 'Host', guest: guestCharacter ? guestCharacter.name : 'Guest' });
    
                const selectedSkins = {
                    host: data.skins[0],
                    guest: data.skins[1]
                };
                // const selectedDivisions = {
                //     host: data.divisions[0],
                //     guest: data.divisions[1]
                // };
                setSkins(selectedSkins);
                // setDivisions(selectedDivisions);
            } else {
                console.log('This client is not part of the match');
            }
        });
    
        return () => {
            newSocket.off('connect');
            newSocket.off('disconnect');
            newSocket.off('start');
            newSocket.close();
        };
    }, [characterIds, characters]);

    const loadCharacters = async () => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const userId = decryptToken(token).sub;
            try {
                const chars = await retrieveCharacter(userId);
                setCharacters(chars);
                const ids = new Set(chars.map(char => char._id));
                setCharacterIds(ids);

                const elos = await getEloFromCharacter(userId);
                const eloData = chars.reduce((acc, char, index) => {
                    const { img, class: eloClass } = getEloImageAndClass(elos[index]);
                    acc[char._id] = { img, class: eloClass };
                    return acc;
                }, {});
                setEloImages(eloData);
                setEloClasses(eloData);
            } catch (err) {
                console.error('Error retrieving characters:', err);
                setCharacters([]);
                setCharacterIds(new Set());
            }
        }
    };

    useEffect(() => {
        loadCharacters();
    }, []);
    
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const userId = decryptToken(token).sub;
            retrieveUser(userId)
                .then((user) => {
                    setInventoryItems(user.inventory);
                })
                .catch((error) => {
                    console.error('Error retrieving inventory items:', error);
                });
        }
    }, []);

    const handleCreateCharacterClick = () => {
        setShowCreateCharacter(true);
    };

    const handlePlayClick = (id) => {
        if (socket) {
            const selectedCharacter = characters.find(char => char._id === id);
            const selectedSkin = skins[id] || selectedCharacter.clase.toLowerCase();
            const characterName = selectedCharacter ? selectedCharacter.name : 'Unknown';

            if (!searching) {
                socket.emit('findMatch', { id: id, skin: selectedSkin, name: characterName });
                console.log({ id: id, skin: selectedSkin, name: characterName });
                setSearching(true);
            } else {
                socket.emit('cancelMatch', { id: id });
                setSearching(false);
            }
        }
    };

    const handleDeleteCharacterClick = () => {
        if (selectedCharacterId) {
            setShowConfirmDialog(true);
        } else {
            alert("No character selected");
        }
    };

    const handleCloseCreateCharacter = () => {
        setShowCreateCharacter(false);
    };

    const handleCharacterCreated = () => {
        loadCharacters();
    };

    const handleConfirmDelete = () => {
        if (selectedCharacterId) {
            deleteCharacter(selectedCharacterId)
                .then(() => {
                    loadCharacters();
                })
                .catch(err => {
                    console.error('Error deleting character:', err);
                    loadCharacters();
                })
                .finally(() => {
                    setShowConfirmDialog(false);
                    setSelectedCharacterId(null);
                });
        }
    };

    const handleSelectSkin = (characterId, event) => {
        const name = event.target.value.toLowerCase().replace(/\s+/g, '').trim();
        setSkins(prevSkins => ({ ...prevSkins, [characterId]: name }));
    };

    const handleCancelDelete = () => {
        setShowConfirmDialog(false);
    };

    if (gameFound) {
        return <Game socket={socket} roomId={roomId} characterIds={characterIds} characters={characters} players={players} playerNames={playerNames} skins={skins} />;
    }

    const handleSelectChar = (id) => {
        setSelectedCharacterId(id);
        setEnabledSkinSelectors({ [id]: true });
    };

    const getCharacterImage = (clase) => {
        switch (clase) {
            case 'Warrior':
                return '/assets/img/Warrior.png';
            case 'Mage':
                return '/assets/img/Mage.png';
            case 'Assassin':
                return '/assets/img/Assassin.png';
            default:
                return '/assets/img/default.png';
        }
    };

    const getGifCharacter = (clase) => {
        switch (clase) {
            case 'Warrior':
                return '/assets/img/homeGif/Warrior.gif';
            case 'Mage':
                return '/assets/img/homeGif/Mage.gif';
            case 'Assassin':
                return '/assets/img/homeGif/Assassin.gif';
            default:
                return '/assets/img/homeGif/default.gif';
        }
    };

    const getEloImageAndClass = (elo) => {
        switch(elo) {
            case 'iron':
                return { img: '/assets/img/elo/iron.png', class: 'elo-iron' };
            case 'bronze':
                return { img: '/assets/img/elo/bronze.png', class: 'elo-bronze' }; 
            case 'silver':
                return { img: '/assets/img/elo/silver.png', class: 'elo-silver' }; 
            case 'gold':
                return { img: '/assets/img/elo/gold.png', class: 'elo-gold' }; 
            case 'platinum':
                return { img: '/assets/img/elo/platinum.png', class: 'elo-platinum' }; 
            case 'emerald':
                return { img: '/assets/img/elo/emerald.png', class: 'elo-emerald' }; 
            case 'diamond':
                return { img: '/assets/img/elo/diamond.png', class: 'elo-diamond' }; 
            case 'master':
                return { img: '/assets/img/elo/master.png', class: 'elo-master' }; 
            case 'grandmaster':
                return { img: '/assets/img/elo/grandmaster.png', class: 'elo-grandmaster' };
            case 'challenger':
                return { img: '/assets/img/elo/challenger.png', class: 'elo-challenger' }; 
            default:
                return { img: '/assets/img/elo/default.png', class: 'elo-default' }; 
        }
    }

    const handleOpenChat= () => {
        setShowChatModal(true);
    }

    const handleCloseChat = ()  => {
        setShowChatModal(false);
    }

    return (
        <div className="form-home">
            <div className="row">
                {characters.map(char => (
                    <div className="col-md-3" key={char._id}>
                        <div className='centrator'>
                            <div className='character-gif'>
                                <img className='image-gif' src={getGifCharacter(char.clase)} alt={`${char.clase} gif`} />
                            </div>
                            <div
                                className={`character-card ${selectedCharacterId === char._id ? 'selected' : ''} ${eloClasses[char._id]?.class}`}
                                onClick={() => handleSelectChar(char._id)}
                            >
                                <img src={getCharacterImage(char.clase)} alt={char.clase} className="character-icon" />
                                <img className='character-elo' src={eloImages[char._id]?.img} alt="Elo" />
                                <div className="character-class">{char.clase}</div>
                                <div className="character-name">{char.name}</div>
                                <div className="character-name">
                                    {inventoryItems.some(item => item.name.toLowerCase().includes('skin') && item.name.toLowerCase().includes(char.clase.toLowerCase())) && (
                                        <select 
                                            className="form-select form-select-lg mb-3" 
                                            onChange={(e) => handleSelectSkin(char._id, e)}
                                            disabled={!enabledSkinSelectors[char._id]} 
                                        >
                                            <option value={char.clase.toLowerCase()}>No skin</option>
                                            {inventoryItems
                                                .filter(item => item.name.toLowerCase().includes('skin') && item.name.toLowerCase().includes(char.clase.toLowerCase()))
                                                .map((item) => (
                                                    <option key={item.itemId} value={item.name}>{item.name}</option>
                                                ))}
                                        </select>
                                    )}
                                </div>
                                <div className="character-wins">👑 {char.win_streak}</div>
                            </div>
                        </div>
                    </div>
                ))}
                {characters.length < 4 && (
                    <div className="center-container">
                        <div className="col-md-5">
                            <button className="btn btn-primary" onClick={handleCreateCharacterClick}>Create character</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="center-container">
                <div className="character-btn">
                    <button 
                        className="btn btn-success" 
                        onClick={() => handlePlayClick(selectedCharacterId)} 
                        disabled={!selectedCharacterId}  
                    >
                        {searching ? <span><img src="https://i.gifer.com/ZKZg.gif" alt="Searching..." style={{ width: 20, marginRight: 5 }} />Searching game...</span> : gameFound ? "✔ Game found!" : 'Play'}
                    </button>
                    <button 
                        className="btn btn-danger" 
                        onClick={handleDeleteCharacterClick} 
                        disabled={!selectedCharacterId}
                    >
                        Delete
                    </button>
                </div>
            </div>
            <div className="chat-btn-container">
                <button onClick={handleOpenChat} className='chat-btn'>💬 Chat</button>
            </div>
            <CreateCharacterForm onClose={handleCloseCreateCharacter} showModal={showCreateCharacter} onCharacterCreated={handleCharacterCreated} />
            <ConfirmDialog 
                show={showConfirmDialog} 
                character={characters.find(char => char._id === selectedCharacterId)} 
                onConfirm={handleConfirmDelete} 
                onCancel={handleCancelDelete} 
            />
            <Friends show={showChatModal} onClose={handleCloseChat} />
        </div>
    );
}    

export default Home;
