import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import './Footer.css';

const Footer = () => {
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setSubmitted(true);
    };

    return (
        <div className="footer">
            <div className="footer-wrapper">
                <div className="footer-top">
                    <p className="footer-top-name">CubeHub</p>
                    <p className="footer-top-extra">something about the website</p>
                </div>
                <div className="footer-middle">
                    <div className="footer-middle-left">
                        <p className="footer-middle-left-title">Some of my links</p>
                        <Link className="footer-middle-left-links" to='https://github.com/rainaBhavesh03/'>Github</Link>
                        <Link className="footer-middle-left-links" to='https://leetcode.com/rainaBhavesh03/'>Leetcode</Link>
                        <Link className="footer-middle-left-links" to='https://linkedin.com/rainabhavesh03/'>Linkedin</Link>
                    </div>
                    <div className="footer-middle-right">
                        <p className="footer-middle-right-title">Contact Me</p>
                        {submitted ? (
                            <p>Thank you for your message!</p>
                        ) : (
                            <form className="footer-middle-right-form" onSubmit={handleSubmit}>
                                <div className="footer-middle-right-formdiv">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={user?.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="footer-middle-right-formdiv">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="footer-middle-right-formdiv">
                                    <label htmlFor="message">Message:</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                    ></textarea>
                                </div>
                                <button type="submit">Send Message</button>
                            </form>
                        )}
                    </div>
                </div>
                <div className="footer-bottom">
                    <p className="footer-bottom-text">Copyright @ 2024 CubeHub</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
