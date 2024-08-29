
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './view/Home';
import RegisterForm from './view/Register';
import backgroundImage from './img/anhnentrangchu.jpg';
import './css/App.css';
import Navbar from './view/Navbar';
import Footer from './view/Footer';
import LogForm from './view/Log';
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
       <h1><Navbar /></h1> 
        </header>
        <main className="App-main">
          <img src={backgroundImage} className="App-background-image" alt="background" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/logs" element={<LogForm />} />
          </Routes>
        
        </main>
   <footer> <Footer/></footer>
      </div>
      
    </Router>
  );
}

export default App;
