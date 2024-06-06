// src/containers/HomePage.js
import React from 'react';
import MainSection from '../components/MainSection'; 
import Login from '../auth/Login';

const HomePage = () => {
  const token = localStorage.getItem('token');
  
  return token ? <MainSection /> : <Login />;
};

export default HomePage;