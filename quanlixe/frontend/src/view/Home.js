
import React from 'react';
import backgroundImage from '../img/anhnentrangchu.jpg';
import '../css/App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const Home = () => {
  return (
    <div>
      <img src={backgroundImage} className="App-background-image" alt="background" />
      <div className="App-content">
       
        
      </div>
    </div>
  );
};

export default Home;
