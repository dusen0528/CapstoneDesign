// src/components/AuthCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchToken = async () => {
            const { code } = queryString.parse(window.location.search);
            if (!code) {
                console.error('Code not found');
                navigate('/');
                return;
            }

            try {
                const response = await axios.post(`http://localhost:3000/api/auth/kakao/login`, { code });
                localStorage.setItem('token', response.data.jwt);
                navigate('/main');
            } catch (error) {
                console.error('Authentication error', error);
                navigate('/');
            }
        };

        fetchToken();
    }, [navigate]);

    return <div>Authenticating...</div>;
};

export default AuthCallback;
