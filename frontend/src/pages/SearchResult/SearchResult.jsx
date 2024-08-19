import React, { useEffect, useState } from 'react';
import './SearchResult.css';
import ProductsDisplay from '../../components/ProductsDisplay/ProductsDisplay';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import useReactRouterBreadcrumbs from 'use-react-router-breadcrumbs';
import Slider from 'react-slider';

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('categories')?.length > 0 ? searchParams.get('categories').split(',') : [];
    const sortParam = searchParams.get('sort') || 'name-asc';
    const typeParam = searchParams.get('types')?.length > 0 ? searchParams.get('types').split(',') : [];
    const ratingParam = searchParams.get('rating') || 0;
    const priceParam = { min: 0, max: 10000 };

    const [searchResults, setSearchResults] = useState([]);
    const [sortOption, setSortOption] = useState(sortParam);
    const [selectedCategories, setSelectedCategories] = useState(categoryParam);
    const [selectedTypes, setSelectedTypes] = useState(typeParam);
    const [selectedRating, setSelectedRating] = useState(ratingParam);
    const [priceRange, setPriceRange] = useState(priceParam);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    const [showSkeleton, setShowSkeleton] = useState(true);
    const [reset, setReset] = useState(false);

    const searchTerm = searchParams.get('term') || '';
    const breadcrumbs = useReactRouterBreadcrumbs();

    const fetchSearchResults = async () => {
        try {
            const response = await axios.get(`http://localhost:4001/products/search?term=${searchTerm}&categories=${selectedCategories}&types=${selectedTypes}&rating=${selectedRating}&price_range=${JSON.stringify(priceRange)}&sort_by=${sortOption}`);
            setSearchResults(response.data);
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

    const handleApply = () => {
        setShowSkeleton(true);
        fetchSearchResults().then(() => setShowSkeleton(false));
    };

    const resetParams = async () => {
        setSelectedTypes(typeParam);
        setSelectedRating(ratingParam);
        setPriceRange(priceParam);
        setSelectedCategories(categoryParam);
        setSortOption(sortParam);
    };

    const handleClear = () => {
        setReset(true);
        resetParams();
    };

    useEffect(() => {
        fetchCategories();
        fetchTypes();
    }, []);

    useEffect(() => {
        handleApply();
    }, [searchTerm]);

    // Trigger handleApply after all states are updated
    useEffect(() => {
        if (reset){
            setReset(false);
            if(
            selectedCategories === categoryParam &&
            selectedTypes === typeParam &&
            selectedRating === ratingParam &&
            priceRange === priceParam &&
            sortOption === sortParam
            ) {
                handleApply();
            }
        }
        else{
            handleApply();
        }
    }, [selectedCategories, selectedRating, selectedTypes, priceRange, sortOption, reset]);

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
                            <option value="0">All Ratings</option>
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

                    <div className='searchresults-left-ctrl'>
                        <button className="searchresults-left-apply" onClick={handleApply}>Apply</button>
                        <button className="searchresults-left-clear" onClick={handleClear}>Clear</button>
                    </div>
                </div>

                <div className="searchresults-right">
                    <div className="searchresults-header">
                        {searchTerm !== '' ? (<p className="searchresults-header-text">Search Results for : {searchTerm}</p>) :
                            (<p className="searchresults-header-text">All products</p>)}
                        <p className="searchresults-header-sort">
                            Sort by :
                            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                                <option value="name-asc">A to Z</option>
                                <option value="name-desc">Z to A</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating">Rating</option>
                            </select>
                        </p>
                    </div>
                    
                    <div className="searchresults-products">
                        <ProductsDisplay products={searchResults} showSkeleton={showSkeleton} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;

