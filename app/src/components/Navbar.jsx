import React, { useState, useEffect } from 'react';
import logic from '../logic';
import { logger } from '../utils';
import Ranking from '../components/Ranking';
import ShopModal from '../components/ShopModal';
import InventoryModal from '../components/InventoryModal';
import './Navbar.css';
import ArenaPoints from '../components/ArenaPoints';
import Information from '../components/Information';
import Profile from '../components/Profile';

function Navbar({ onUserLoggedOut }) {
    const [user, setUser] = useState(null);
    const [showRanking, setShowRanking] = useState(false);
    const [showShop, setShowShop] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [showArenaPointsShop ,setShowArenaPointsShop] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    let token = sessionStorage.getItem('token');

    const handleLogoutClick = () => {
        try {
            logic.logoutUser();
        } catch (error) {
            logic.cleanUpLoggedInUserId();
        } finally {
            onUserLoggedOut();
        }
    };

    const handleBuyArenaPoints = () => {
        setShowArenaPointsShop(true);
    }

    const handleCloseBuyArenaPoints = () => {
        setShowArenaPointsShop(false);
    }

    const handleOpenRanking = () => {
        setShowRanking(true);
    };

    const handleCloseRanking = () => {
        setShowRanking(false);
    };

    const handleOpenShop = () => {
        setShowShop(true);
    };

    const handleCloseShop = () => {
        setShowShop(false);
    };

    const handleOpenInventory = () => {
        setShowInventory(true);
    };

    const handleCloseInventory = () => {
        setShowInventory(false);
    };

    const handleOpenInfo = () => {
        setShowInfo(true);
    }

    const handleCloseInfo = () => {
        setShowInfo(false);
    }
    const handleOpenProfile  = () => {
        setShowProfile(true);
    }
    const handleCloseProfile  = () => {
        setShowProfile(false);
    }

    const updateUser = () => {
        if (token) {
            logic.retrieveUser(token)
                .then(usuario => {
                    setUser(usuario);
                })
                .catch(error => {
                    logger.error('Error al recuperar usuario:', error);
                });
        }
    };

    useEffect(() => {
        updateUser();
    }, [token]);

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" onClick={handleOpenInfo} href="#">⚔️</a>
                    <div className="user-points">
                        {user && (
                            <>
                                <button className="btn btn-secondary">
                                    {user.honor_points} | 💰 Honor Points
                                </button>
                                <button className="btn btn-secondary ms-2" onClick={handleBuyArenaPoints}>
                                    {user.arena_points} | 💎 Arena Points
                                </button>
                            </>
                        )}
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <h2 className='title-aoh'>Arena of Honor</h2>
                            </li>
                        </ul>
                    </div>
                    <div className='user-token'>
                        {user && (
                            <div className="dropdown show">
                                <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Welcome, {user.name}!
                                </a>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                    <a className="dropdown-item" onClick={handleOpenProfile} href="#"> 👤  | Profile</a>
                                    <a className="dropdown-item" onClick={handleOpenShop} href="#">🛒 | Shop</a>
                                    <a className="dropdown-item" onClick={handleOpenInventory} href="#">🎒 | Inventory</a>
                                    <a className="dropdown-item" onClick={handleOpenRanking} href="#">🏆 | Ranking</a>
                                    <a className="dropdown-item" href="#" onClick={handleLogoutClick}>❌ | Close session</a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <Ranking show={showRanking} onClose={handleCloseRanking} />
            <ShopModal show={showShop} onClose={handleCloseShop} onBuyItem={updateUser} />
            <InventoryModal show={showInventory} onClose={handleCloseInventory} />
            <ArenaPoints show={showArenaPointsShop} onClose={handleCloseBuyArenaPoints} onBuyItem={updateUser} />
            <Information show={showInfo} onClose={handleCloseInfo} />
            <Profile show={showProfile} onClose={handleCloseProfile} />
        </>
    );
}

export default Navbar;
