import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);

    const login = () => {
        console.log("Login function triggered!"); // Check your terminal for this!
        setUserToken('dummy-token'); 
    };

    const logout = () => {
        setUserToken(null);
    };

    return (
        <AuthContext.Provider value={{ login, logout, userToken }}>
            {children}
        </AuthContext.Provider>
    );
};