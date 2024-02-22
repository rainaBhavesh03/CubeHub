import { React, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const Landing = () => {
    const [redirectMessage, setRedirectMessage] = useState(null);

    useEffect(() => {
        const storedMessage = localStorage.getItem('redirectMessage');
        if (storedMessage) {
            setRedirectMessage(storedMessage);
        }
    }, []);

    return (
        <div className='landing'>
            <p>This is the landing page</p>
            {redirectMessage && (
                <div className="redirect-message">
                    <p>{redirectMessage}</p>
                    <button onClick={() => {setRedirectMessage(null); localStorage.removeItem('redirectMessage');}}>Dismiss</button>
                </div>
            )}
        </div>
    )
}

export default Landing;
