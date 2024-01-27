import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Landing from './pages/Landing/Landing';
import Admin from './pages/Admin/Admin';
import Register from './components/Register/Register';
import Logout from './components/Logout/Logout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/logout" element={<Logout/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<Landing/>} />
        <Route path="/admin/*" element={<Admin/>} />
      </Routes>
    </Router>
  );
};

export default App;

