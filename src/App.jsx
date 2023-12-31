import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SplashPage from './pages/SplashPage';
import FriendsPage from './pages/FriendsPage';

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/friends" element={<FriendsPage />} />
      </Routes>
    </Router>


  )
}

export default App
