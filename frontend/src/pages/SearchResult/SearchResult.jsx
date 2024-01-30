import React, { useEffect, useState } from 'react';
import './SearchResult.css';
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay';
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
        <div>
        <h2>Search Results for: {searchTerm}</h2>
        <ProductDisplay products={searchResults} />
        </div>
    );
};

export default SearchResult;
