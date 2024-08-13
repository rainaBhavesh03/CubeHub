import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router';

const AuthContext = createContext({
    isLoggedIn: false,
    user: {},
    login: () => {},
    logout: () => {},
    verifyUser: () => {},
});

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    const protectedRoutes = ['/admin', '/checkout', '/login'];

    useEffect(() => {
        if(!user){
            getUser();
        }

        const currentPath = location.pathname;
        const isProtected = protectedRoutes.some(route => currentPath.startsWith(route));

        if(isProtected){
            checkProtected(currentPath);
        }
    }, [location.pathname]);

    const checkProtected = async (currentPath) => {
        const res = await verifyUser();

        if(res){
            if(currentPath === '/login')
                navigate('/');
        }
        else {
            console.log('inside catch');
            if(currentPath !== '/login'){
                setIsLoggedIn(false);
                setUser(null);
                alert('Please login first!!');
                navigate('/login');
            }
        }
    };

    const getUser = async () => {
        try{
            const res = await axios.get('http://localhost:4001/auth/getuserdetails', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`,
                }
            });

            setUser(res.data.user);
            setIsLoggedIn(true);
        }
        catch (err){
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
        }
    };

    const verifyUser = async () => {
        try{
            const res = await axios.get('http://localhost:4001/auth/verifyuser', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });

            return true;
        }
        catch (err){
            console.error('Not verified', err);

            return false;
        }
    }

    const login = async ({ email, password }) => {
        try{
            const res = await axios.post('http://localhost:4001/auth/login', { email, password });
            const { accessToken, refreshToken, user } = res.data;

            // Store tokens in cookies
            Cookies.set('accessToken', accessToken);
            Cookies.set('refreshToken', refreshToken);

            setUser(user);
            setIsLoggedIn(true);
        }
        catch (err){
            console.error(err);
        }
    }

    const logout = async () => {
        try {
            await axios.post('http://localhost:4001/auth/logout');

            // Clear tokens cookie
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');

            setUser(null);
            setIsLoggedIn(false);
            console.log('Logged out successfully');
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                login,
                logout,
                verifyUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };


