import React, { useEffect, useState } from 'react';
import logic from '../logic';

function InventoryModal({ show, onClose }) {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show) {
            const token = sessionStorage.getItem('token');
            if (token) {
                const userId = logic.decryptToken(token).sub;
                logic.retrieveUser(userId)
                    .then((user) => {
                        setInventoryItems(user.inventory);
                        setError(null);
                    })
                    .catch((error) => {
                        console.error('Error retrieving inventory items:', error);
                        setError('Failed to retrieve inventory items');
                    });
            }
        }
    }, [show]);

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>🎒 Inventory</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryItems.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default InventoryModal;
