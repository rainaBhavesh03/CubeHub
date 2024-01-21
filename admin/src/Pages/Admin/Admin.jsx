import React from "react";
import './Admin.css'
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import AddProduct from "../../Components/AddProduct/AddProduct";
import ListProduct from "../../Components/ListProduct/ListProduct";
import RemoveProduct from "../../Components/RemoveProduct/RemoveProduct";
import EditProduct from "../../Components/EditProduct/EditProduct";

const Admin = () => {
    return (
        <div className="admin">
            <Sidebar />
            <Routes>
                <Route path='/addproduct' element={<AddProduct />} />
                <Route path='/removeproduct' element={<RemoveProduct />} />
                <Route path='/listproduct' element={<ListProduct />} />
                <Route path='/editproduct/:productId' element={<EditProduct />} />
            </Routes>
        </div>
    )
}

export default Admin
