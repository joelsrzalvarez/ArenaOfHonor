import React, { useEffect, useState } from 'react';
import logic from '../logic';

function Information({ show, onClose }) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>❓ Ranks Info</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    <ul>
                        <li>If you win you will add 30 points to your character</li>
                        <li>If you lose 18 points will be removed from your character</li>
                        ❗ Can't have less than 0 elo points
                    </ul>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Requirements</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><img src='assets/img/elo/iron.png' width='80px' height='80px'></img></td>
                                <td>0</td>
                            </tr>
                            <tr>
                            <td><img src='assets/img/elo/bronze.png' width='80px' height='80px'></img></td>
                                <td>1 - 500</td>
                            </tr>
                            <tr>
                            <td><img src='assets/img/elo/silver.png' width='80px' height='80px'></img></td>
                                <td>501 - 799</td>
                            </tr>
                            <tr>
                            <td><img src='assets/img/elo/gold.png' width='80px' height='80px'></img></td>
                                <td>800 - 999</td>
                            </tr>
                            <tr>
                            <td><img src='assets/img/elo/platinum.png' width='80px' height='80px'></img></td>
                                <td>1000 - 1499</td>
                            </tr>
                            <tr>
                            <td><img src='assets/img/elo/emerald.png' width='80px' height='80px'></img></td>
                                <td>1500 - 1999</td>
                            </tr>
                            <tr>
                            <td><img src='assets/img/elo/diamond.png' width='80px' height='80px'></img></td>
                                <td>2000 - 2499</td>
                            </tr>
                            <tr>
                            <td><img src='assets/img/elo/master.png' width='80px' height='80px'></img></td>
                                <td>2500 - 2999</td>
                            </tr>
                            <tr>
                            <td><img src='assets/img/elo/grandmaster.png' width='80px' height='80px'></img></td>
                                <td>3000 - 3499</td>
                            </tr>
                            <tr>
                            <td><img src='assets/img/elo/challenger.png' width='80px' height='80px'></img></td>
                                <td>+3500</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Information;
