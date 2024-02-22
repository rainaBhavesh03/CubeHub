import React, { useEffect, useState } from 'react';
import './SearchResult.css';
import ProductsDisplay from '../../components/ProductsDisplay/ProductsDisplay';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import useReactRouterBreadcrumbs from 'use-react-router-breadcrumbs';

const SearchResult = () => {
    const [searchResults, setSearchResults] = useState([]);
    const location = useLocation();
    const searchTerm = location.search.split('=')[1];
    const breadcrumbs = useReactRouterBreadcrumbs();

    // Fetch search results based on the searchTerm
    const fetchSearchResults = async () => {
        try {
            const response = await axios.get(`http://localhost:4001/products/search?term=${searchTerm}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    useEffect(() => {
        fetchSearchResults();
    }, [searchTerm]);

    return (
        <div className="searchresults">
            <div className="searchresults-breadcrumb">
                {breadcrumbs.map((crumb, index) => (
                    <p key={index}>
                        {index !== breadcrumbs.length - 1 ? (
                            <a href={crumb.pathname}>{crumb.breadcrumb}</a>
                        ) : (
                            <span>{crumb.breadcrumb}</span>
                        )}
                        <svg className="searchresults-breadcrumb-svg" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M17.17 32.92l9.17-9.17-9.17-9.17 2.83-2.83 12 12-12 12z"/><path d="M0-.25h48v48h-48z" fill="none"/></svg>
                    </p>
                ))}
            </div>
            <div className="searchresults-wrapper">
                <div className="searchresults-left">
                    <p>/* here will be the filter logic */</p>
                </div>
                <div className="searchresults-right">
                    <div className="searchresults-header">
                        <p className="searchresults-header-text">Search Results for: {searchTerm}</p>
                        <p>/* here will be the sorting logic */</p>
                    </div>
                    <div className="searchresults-products">
                        <ProductsDisplay products={searchResults} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;
