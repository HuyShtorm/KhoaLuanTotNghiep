
import React from 'react';
import backgroundImage from '../img/anhnentrangchu.jpg';
import '../css/App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const Home = () => {
  return (
    <div>
      <img src={backgroundImage} className="App-background-image" alt="background" />
      <div className="App-content">
        <button className="buttondn">Đăng nhập</button>
        <p className='cctk'>Chưa có Tài khoản? <Link to="/register" className='dk'>Đăng ký</Link> </p> 
        
      </div>
    </div>
  );
};

export default Home;
