import React, { useEffect, useState } from 'react';
import logic from '../logic';

function Profile({ show, onClose }) {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (show) {
            const token = sessionStorage.getItem('token');
            if (token) {
                logic.retrieveUser(token)
                    .then(data => {
                        setPassword('');
                        setRepeatPassword('');
                    })
                    .catch(error => {
                        console.error('Error al recuperar usuario:', error);
                        sessionStorage.removeItem('token');
                    });
            }
        }
    }, [show]);

    useEffect(() => {
        if (!show) {
            setError(null);
            setSuccess(null);
        }
    }, [show]);

    const handleUpdateUserProfile = (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setError('Passwords do not match');
            setSuccess(null);
        } else {
            const token = sessionStorage.getItem('token');
            if (token) {
                const userId = logic.decryptToken(token).sub;
                logic.updateUserPassword(userId, password)
                    .then(() => {
                        setSuccess('Password updated successfully');
                        setError(null);
                    })
                    .catch(error => {
                        setError('Error updating password');
                        setSuccess(null);
                    });
            }
        }
    }

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>🔑 Change password</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    <div className='form-group'>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
                    </div>
                    <form onSubmit={handleUpdateUserProfile}>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="repeatPassword">Repeat password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="repeatPassword" 
                                value={repeatPassword} 
                                onChange={(e) => setRepeatPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;
