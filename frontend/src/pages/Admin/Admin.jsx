import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import './Admin.css'
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import AddProduct from "../../components/Admin/AddProduct/AddProduct";
import ListProduct from "../../components/Admin/ListProduct/ListProduct";
import EditProduct from "../../components/Admin/EditProduct/EditProduct";
import { AuthContext } from "../../context/AuthContext";

const Admin = () => {
    const { isLoading } = useContext(AuthContext);

    return (
        <div className="admin">
            {isLoading ? (
                <span className="admin-loading"></span>
            ) : (
                <div className="admin-wrapper">
                    <Sidebar />
                    <Routes>
                        <Route path='/addproduct' element={<AddProduct />} />
                        <Route path='/listproduct' element={<ListProduct />} />
                        <Route path='/editproduct/:productId' element={<EditProduct />} />
                    </Routes>
                </div>
            )}
        </div>
    )
}

export default Admin


