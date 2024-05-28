// import React, { createContext, useContext, useState, useEffect } from 'react';
// import logic from '../logic';
// import { logger } from '../utils';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);

//     useEffect(()=> {
//         const token = sessionStorage.getItem('token');
//         if (token) {
//             logic.retrieveUser(token)
//                 .then(usuario => {
//                     console.log(usuario);
//                     setUser(usuario);
//                 })
//                 .catch(error => {
//                     logger.error('Error al recuperar usuario:', error);
//                     sessionStorage.removeItem('token'); 
//                 });
//         }
//     }, [user]);

//     return (
//         <AuthContext.Provider value={{ user, setUser }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);
