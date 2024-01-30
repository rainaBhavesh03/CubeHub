import Cookies from "js-cookie";
import { React, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Panel from "../../components/Admin/Panel/Panel";

const Admin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = Cookies.get('role');
        if (!userRole || userRole !== 'admin') {
            localStorage.setItem('redirectMessage', "User doesn't have admin privileges!");
            navigate('/');
        }
    }, []);

    return (
        <div>
            <Panel />
        </div>
    )
}

export default Admin

