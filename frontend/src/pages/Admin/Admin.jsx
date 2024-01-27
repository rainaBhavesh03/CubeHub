import { React, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/Admin/Navbar/Navbar";
import Panel from "../../components/Admin/Panel/Panel";

const Admin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if (!userRole || userRole !== 'admin') {
            localStorage.setItem('redirectMessage', "User doesn't have admin privileges!");
            navigate('/');
        }
    }, []);

    return (
        <div>
            <Navbar /> 
            <Panel />
        </div>
    )
}

export default Admin

