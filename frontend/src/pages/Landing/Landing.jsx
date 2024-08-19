import axios from 'axios';
import { React, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useNavigate } from 'react-router-dom';
import ProductsDisplay from '../../components/ProductsDisplay/ProductsDisplay';
import './Landing.css';

const Landing = () => {
    // Webpack require.context to dynamically import all banner images
    const importAll = (r) => r.keys().map(r);
    const [banners, setBanners] = useState(importAll(require.context('../../assets/banners/', false)));
    const [bannerIdx, setBannerIdx] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const [prodByRating, setProdByRating] = useState([]);
    const maxToShow = 3;

    const navigate = useNavigate();

    const handleCarouselClick = (index) => {
        setBannerIdx(index);
    }

    const fetchSearchResults = async () => {
        try {
            const response = await axios.get(`http://localhost:4001/products/search?term=`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleRatingClick = () => {
        try {
            const queryParams = new URLSearchParams({
                term: '',
                categories: [].join(','),
                types: [].join(','),
                sort: 'rating',
            });

            navigate(`/search-results?${queryParams.toString()}`);
        }
        catch (error) {
            console.error(error);
        }
    };

    const filterByRating = () => {
        let filteredResults = [...searchResults];

        filteredResults.sort((a, b) => b.averageRating - a.averageRating);

        return filteredResults.slice(0, maxToShow);
    }


    useEffect(() => {
        fetchSearchResults();
    }, []);
    
    useEffect(() => {
        console.log(searchResults);
        setProdByRating(filterByRating());
    }, [searchResults]);

    return (
        <div className='landing'>
            <div className="landing-wrapper">
                <div className='landing-carousel'>
                    <div className='landing-carousel-main'>
                        <img className="landing-carousel-img" src={banners[bannerIdx]} alt='banner image' />
                    </div>
                    <div className='landing-carousel-ctrl'>
                        {banners !== null && banners.map((item, index) => (
                            <input key={index} checked={bannerIdx === index ? true : false} name='landing-carousel-btn' type='radio' onClick={() => handleCarouselClick(index)} />
                        ))}
                    </div>
                </div>

                <div className='landing-byrating'>
                    <div className='landing-byrating-head'>
                        <p className='landing-byrating-title' >By Rating :</p>
                        <button className='landing-byrating-btn' onClick={handleRatingClick}>See More</button>
                    </div>
                    <ProductsDisplay products={prodByRating} showSkeleton={false} />
                </div>
            </div>
        </div>
    )
}

export default Landing;
