import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Landing from './components/Landing/Landing';
import Register from './components/Register/Register';
//import AdminPanel from '../../admin/src/main.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<Landing/>} />
        {/*<Route path="/admin" component={AdminPanel} /> */}
        {/* Other routes for customer pages */}
      </Routes>
    </Router>
  );
};

export default App;

