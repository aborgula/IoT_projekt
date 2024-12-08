
import Navbar from "./components/shared/Navbar";
import Navbarlogout from "./components/shared/Navbarlogout";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./components/Home";
import { isExpired } from "react-jwt";
import LoginForm from './components/Login';
import SignUpForm from './components/SingUpForm';
import React, { useState, useEffect } from 'react';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


function App() {
    
    const token = localStorage.getItem('token') ?? ''; 
    console.log('Is token expired w app?', isExpired(token));

    return (
        <Router>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                {isExpired(token) ? <Navbar /> : <Navbarlogout />}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginForm />} /> 
                    <Route path="/signup" element={<SignUpForm />} /> 
                    <Route path="/device/:id" 
  element={isExpired(localStorage.getItem('token') ?? '') 
    ? <Navigate replace to="/login" /> 
    : <Dashboard /> 
  } 
/>

                </Routes>
            </ThemeProvider>
        </Router>
    );
}

export default App;



