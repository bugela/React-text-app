import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login.jsx'; 
import Register from './components/Register.jsx';
import Sidenav from './components/nevbar/Sidenav.jsx';
import CsrfToken from './components/CsrfToken.jsx';
import Chat from './components/Chat.jsx';

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || '');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Update local storage whenever token or userId changes
    localStorage.setItem('token', token || '');
    localStorage.setItem('userId', userId || '');
  }, [token, userId]);
 

  return (
    <>
     <Router>
     <CsrfToken setCsrfToken={setCsrfToken} />
     <Sidenav />
      <Routes>
        <Route path="/" element={<Login setToken={setToken} setUserId={setUserId} CsrfToken={CsrfToken}/>} />
        <Route path="/register" element={<Register csrfToken={CsrfToken} />} />
        <Route path="/chat" element={<Chat token={token} userId={userId} />} />
      </Routes>
     </Router>
    </>
  )
}

export default App
