import { useState, useEffect } from 'react';
import logic from '../logic';
import decryptToken from '../logic/decryptToken';

export function useUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const userId = decryptToken(token).sub;
            logic.retrieveUser(userId)
                .then(usuario => {
                    setUser(usuario);
                })
                .catch(error => {
                    console.error('Error retrieving user:', error);
                });
        }
    }, []);

    return { user };
}
