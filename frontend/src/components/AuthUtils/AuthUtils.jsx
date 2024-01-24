import axios from 'axios';

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post('http://localhost:4001/refresh-token', { refreshToken });
        const newAccessToken = response.data.accessToken;

        // Update the stored access token
        localStorage.setItem('accessToken', newAccessToken);

        return newAccessToken;
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error; // Rethrow the error for higher-level handling
    }
};

const authenticateRequest = async (url, data) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expired, attempt to refresh
            const newAccessToken = await refreshAccessToken(localStorage.getItem('refreshToken'));

            // Retry the original request with the new access token
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                },
            });

            return response.data;
        }

        // Handle other errors
        console.error('Request failed:', error);
        throw error;
    }
};

export { refreshAccessToken, authenticateRequest };

