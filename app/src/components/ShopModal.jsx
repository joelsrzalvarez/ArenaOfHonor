import React, { useEffect, useState } from 'react';
import logic from '../logic';
import './ShopModal.css';

function ShopModal({ show, onClose, onBuyItem }) {
    const [shopItems, setShopItems] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleBuyItem = (itemId) => {
        const token = sessionStorage.getItem('token');
        if(token) {
            const userId = logic.decryptToken(token).sub;
            logic.buyItem(userId, itemId)
            .then((data) => {
                setSuccess(data.message)
                setError(null);
                onBuyItem(); 
            })
            .catch(error => {
                console.error(error.message);
                setError(error.message); 
            });
        }
    };

    useEffect(() => {
        if (!show) {
            setError(null);
            setSuccess(null);
        }
    }, [show]);

    useEffect(() => {
        if (show) {
            logic.retrieveShop()
                .then((data) => {
                    setShopItems(data);
                })
                .catch((error) => {
                    console.error('Error retrieving shop items:', error);
                    setError('Failed to retrieve shop items');
                });
        }
    }, [show]);

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>🛒 Shop</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Points</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shopItems.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.type}</td>
                                    <td>
                                        <button
                                            className='btn btn-primary'
                                            type='button'
                                            onClick={() => handleBuyItem(item._id)}
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

export default ShopModal;
