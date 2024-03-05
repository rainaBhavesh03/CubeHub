import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Landing from './pages/Landing/Landing';
import Admin from './pages/Admin/Admin';
import Register from './pages/Register/Register';
import Navbar from './components/Navbar/Navbar';
import SearchResult from './pages/SearchResult/SearchResult';
import ProductInfo from './pages/ProductInfo/ProductInfo';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Cart from './pages/Cart/Cart';

const App = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/" element={<Landing />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/search-results" element={<SearchResult />} />
                <Route path="/product/:productId" element={<ProductInfo />} />
            </Routes>
        </>
    );
};

export default App;
