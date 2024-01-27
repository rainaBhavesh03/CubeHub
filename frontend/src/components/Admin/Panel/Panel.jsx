import React from "react";
import './Panel.css'
import Sidebar from "../Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import AddProduct from "../AddProduct/AddProduct";
import ListProduct from "../ListProduct/ListProduct";
import EditProduct from "../EditProduct/EditProduct";

const Panel = () => {
    return (
        <div className="panel">
            <Sidebar />
            <Routes>
                <Route path='/addproduct' element={<AddProduct />} />
                <Route path='/listproduct' element={<ListProduct />} />
                <Route path='/editproduct/:productId' element={<EditProduct />} />
            </Routes>
        </div>
    )
}

export default Panel

