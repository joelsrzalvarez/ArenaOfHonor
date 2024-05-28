import React, { useEffect, useState } from 'react';
import logic from '../logic';
import './ArenaPoints.css';

function ArenaPoints({ show, onClose, onBuyItem }) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const pointsOptions = [
        { quantity: 310, price: 2.5 },
        { quantity: 650, price: 5 },
        { quantity: 1380, price: 10 },
        { quantity: 2800, price: 20 },
        { quantity: 5000, price: 35 },
        { quantity: 7800, price: 50 }
    ];

    useEffect(() => {
        if (!show) {
            setError(null);
            setSuccess(null);
        }
    }, [show]);

    const handlePurchase = async (quantity, price) => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const { sub: userId } = logic.decryptToken(token);
                await logic.buyArenaPoints(userId, quantity);
                setSuccess(`Successfully purchased ${quantity} arena points for ${price}€`);
                setError(null);
                onBuyItem(); 
            }
        } catch (err) {
            setError('Purchase failed. Please try again.');
            setSuccess(null);
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>💎 Buy Arena Points 💎</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <table className="table">
                        <thead>
                            <tr>
                                <th> * </th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pointsOptions.map(option => (
                                <tr key={option.quantity}>
                                    <td>💎</td>
                                    <td>{option.quantity}</td>
                                    <td>{option.price}€</td>
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handlePurchase(option.quantity, option.price)}
                                        >
                                            Buy
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ArenaPoints;
