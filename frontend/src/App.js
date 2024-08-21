import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
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
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Checkout from './pages/Checkout/Checkout';
import Footer from './components/Footer/Footer';

const App = () => {
    const location = useLocation();
    const noHeader = ['/login', '/register', '/forgot-password', '/reset-password'];
    const noFooter = ['/login', '/register', '/forgot-password', '/reset-password', '/checkout'];

    return (
        <AuthProvider>
        <CartProvider>
            {noHeader.some(path => location.pathname.startsWith(path)) || <Navbar />}
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
                <Route path="/checkout" element={<Checkout />} />
            </Routes>
            {noFooter.some(path => location.pathname.startsWith(path)) || <Footer />}
        </ CartProvider>
        </ AuthProvider>
    );
};

export default App;
