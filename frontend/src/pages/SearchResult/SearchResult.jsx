import React, { useEffect, useState } from 'react';
import './SearchResult.css';
import ProductsDisplay from '../../components/ProductsDisplay/ProductsDisplay';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SearchResult = () => {
    const [searchResults, setSearchResults] = useState([]);
    const location = useLocation();
    const searchTerm = location.search.split('=')[1];

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
