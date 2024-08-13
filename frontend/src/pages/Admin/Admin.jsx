import { React, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Panel from "../../components/Admin/Panel/Panel";
import { AuthContext } from "../../context/AuthContext";

const Admin = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);


    return (
        <div>
            <Panel />
        </div>
    )
}

export default Admin

