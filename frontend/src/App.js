import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Landing from './pages/Landing/Landing';
import Admin from './pages/Admin/Admin';
import Register from './components/Register/Register';
import Navbar from './components/Navbar/Navbar';
import SearchResult from './pages/SearchResult/SearchResult';
import ProductInfo from './pages/ProductInfo/ProductInfo';

const App = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Landing />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/search-results" element={<SearchResult />} />
                <Route path="/product/*" element={<ProductInfo />} />
            </Routes>
        </>
    );
};

export default App;
