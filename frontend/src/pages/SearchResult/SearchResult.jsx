import React, { useEffect, useState } from 'react';
import './SearchResult.css';
import ProductsDisplay from '../../components/ProductsDisplay/ProductsDisplay';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import useReactRouterBreadcrumbs from 'use-react-router-breadcrumbs';
import Slider from 'react-slider';

const SearchResult = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [sortOption, setSortOption] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedRating, setSelectedRating] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    const location = useLocation();
    const searchTerm = location.search.split('=')[1];
    const breadcrumbs = useReactRouterBreadcrumbs();

    const fetchSearchResults = async () => {
        try {
            const response = await axios.get(`http://localhost:4001/products/search?term=${searchTerm}`);
            setSearchResults(response.data);
            setFilteredResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:4001/categories/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchTypes = async () => {
        try {
            const response = await axios.get('http://localhost:4001/types/types');
            setTypes(response.data);
        } catch (error) {
            console.error("Error fetching types:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchTypes();
    }, []);

    useEffect(() => {
        fetchSearchResults();
    }, [searchTerm]);

    const applySorting = (results, option) => {
        let sortedResults = [...results];
        switch (option) {
            case 'price-asc':
                sortedResults.sort((a, b) => a.new_price - b.new_price);
                break;
            case 'price-desc':
                sortedResults.sort((a, b) => b.new_price - a.new_price);
                break;
            case 'rating':
                sortedResults.sort((a, b) => b.averageRating - a.averageRating);
                break;
            case 'name-desc':
                sortedResults.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                sortedResults.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        return sortedResults;
    };

    const applyFiltering = (results) => {
        let filteredResults = [...results];

        // Filter by multiple categories
        if (selectedCategories.length > 0) {
            filteredResults = filteredResults.filter(product =>
                product.category && product.category.some(catId => selectedCategories.includes(catId))
            );
        }

        // Filter by multiple types
        if (selectedTypes.length > 0) {
            filteredResults = filteredResults.filter(product =>
                product.type && product.type.some(typeId => selectedTypes.includes(typeId))
            );
        }

        // Filter by rating
        if (selectedRating) {
            filteredResults = filteredResults.filter(product =>
                product.averageRating >= parseFloat(selectedRating)
            );
        }

        // Filter by price range
        if (priceRange.min || priceRange.max) {
            filteredResults = filteredResults.filter(product => {
                const price = product.new_price;
                return (!priceRange.min || price >= parseFloat(priceRange.min)) &&
                    (!priceRange.max || price <= parseFloat(priceRange.max));
            });
        }

        return filteredResults;
    };

    useEffect(() => {
        let results = applyFiltering(searchResults);
        results = applySorting(results, sortOption);
        setFilteredResults(results);
    }, [searchResults, sortOption, selectedCategories, selectedTypes, selectedRating, priceRange]);

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
                        <svg className="searchresults-breadcrumb-svg" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.17 32.92l9.17-9.17-9.17-9.17 2.83-2.83 12 12-12 12z"/>
                            <path d="M0-.25h48v48h-48z" fill="none"/>
                        </svg>
                    </p>
                ))}
            </div>
            <div className="searchresults-wrapper">
                <div className="searchresults-left">
                    <div className="searchresults-left-rating">
                        <p>Rating</p>
                        <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
                            <option value="">All Ratings</option>
                            <option value="1">1 star & up</option>
                            <option value="2">2 stars & up</option>
                            <option value="3">3 stars & up</option>
                            <option value="4">4 stars & up</option>
                        </select>
                    </div>

                    <div className="searchresults-left-price">
                        <p>Price</p>
                        <Slider className="searchresults-left-slider" onChange={(value) => setPriceRange({ min: value[0], max: value[1] })} value={[priceRange.min, priceRange.max]} min={0} max={10000}/>
                        <input
                            className="searchresults-left-slider-input"
                            type="number"
                            placeholder="Min Price"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        />
                        <input
                            className="searchresults-left-slider-input"
                            type="number"
                            placeholder="Max Price"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        />
                    </div>

                    <div className="searchresults-left-categories">
                        <p>Product Category</p>
                        {categories.map(category => (
                            <div key={category._id}>
                                <input
                                    type="checkbox"
                                    id={`category-${category._id}`}
                                    value={category._id}
                                    checked={selectedCategories.includes(category._id)}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedCategories(prev =>
                                            prev.includes(value)
                                                ? prev.filter(cat => cat !== value)
                                                : [...prev, value]
                                        );
                                    }}
                                />
                                <label htmlFor={`category-${category._id}`}>{category.name}</label>
                            </div>
                        ))}
                    </div>

                    <div className="searchresults-left-types">
                        <p>Product Type</p>
                        {types.map(type => (
                            <div key={type._id}>
                                <input
                                    type="checkbox"
                                    id={`type-${type._id}`}
                                    value={type._id}
                                    checked={selectedTypes.includes(type._id)}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedTypes(prev =>
                                            prev.includes(value)
                                                ? prev.filter(t => t !== value)
                                                : [...prev, value]
                                        );
                                    }}
                                />
                                <label htmlFor={`type-${type._id}`}>{type.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="searchresults-right">
                    <div className="searchresults-header">
                        {searchTerm !== '' ? (<p className="searchresults-header-text">Search Results for : {searchTerm}</p>) :
                            (<p className="searchresults-header-text">All products</p>)}
                        <p className="searchresults-header-sort">
                            Sort by :
                            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                                <option value="">A to Z</option>
                                <option value="name-desc">Z to A</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating">Rating</option>
                            </select>
                        </p>
                    </div>
                    <div className="searchresults-products">
                        <ProductsDisplay products={filteredResults} fromSearch={true}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;

