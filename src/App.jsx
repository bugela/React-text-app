import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import Login from './components/Login.jsx'; 
import Register from './components/Register.jsx';

function App() {
 

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
     </Router>
    </>
  )
}

export default App
