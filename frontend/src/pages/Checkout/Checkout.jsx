import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { CartContext } from '../../context/CartContext';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart } = useContext(CartContext);

    const [formData, setFormData] = useState({ country: 'India' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        try{
            e.preventDefault();

            //const res = await axios.post('http://localhost:4001/auth/contactme', formData);
            console.log('handleSubmit triggered');

            setFormData({
                country: 'India',
            });
        }
        catch (err){
            console.error(err);
        }
    };


    return (
        <div className="checkout">
            <div className="checkout-wrapper">
                <form className="checkout-left" onSubmit={handleSubmit}>
                    <p className="checkout-header">Contact Information</p>
                    <div className="checkout-formdiv">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="checkout-formdiv2">
                        <input
                            type="text"
                            placeholder="Mobile No."
                            value={formData.mobileNo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="checkout-formdiv">
                        <input
                            id="checkout-address"
                            type="text"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                        <input
                            id="checkout-pincode"
                            type="number"
                            placeholder="Pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="checkout-formdiv">
                        <input
                            type="text"
                            placeholder="Country"
                            value={formData.country}
                            required
                            disabled
                        />
                        <input
                            type="text"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="checkout-formdiv">
                        <button type="submit">Continue</button>
                    </div>
                </form>

                <div className="checkout-right">
                    <div className="checkout-right-wrapper">
                        <div className="checkout-right-top">
                            <span className="checkout-right-header">Order Summary</span>
                            <button className="checkout-right-btn" onClick={() => navigate('/cart')}>Edit Cart?</button>
                        </div>
                        <div className="checkout-right-middle">
                            <div className="checkout-right-middlediv">
                                <span>No. of items :</span><span>{cart?.items.length}</span>
                            </div>
                            <div className="checkout-right-middlediv">
                                <span>Grand Total :</span><span>{cart?.grandTotal}</span>
                            </div>
                            <div className="checkout-right-middlediv">
                                <span>Platform Fees :</span><span>30.00</span>
                            </div>
                        </div>
                        <div className="checkout-right-bottom">
                            <span>Order Total :</span><span>{cart?.grandTotal + 30.00}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Checkout;
