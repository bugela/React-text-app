import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidenav.css'; 

const Sidenav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); 
  const location = useLocation();

  const openNav = () => setIsOpen(true);
  const closeNav = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    localStorage.removeItem('email');
    localStorage.removeItem('invite');

    navigate('/');
  };

  const avatar = localStorage.getItem('avatar'); // Retrieve the avatar URL from local storage
  const isLoggedIn = !!localStorage.getItem('token');
  const isLoginOrRegisterPage = location.pathname === '/' || location.pathname === '/register';

  return (
    <div>
      <div className={`sidenav ${isOpen ? 'open' : ''}`} id="mySidenav">
        <a href="#" className="closebtn" onClick={closeNav}>&times;</a>

        <div className="avatar-container">
          {avatar ? (
            <img src={avatar} alt="User Avatar" className='avatar-img' />
          ) : (
            <p>No Avatar</p>
          )}
        </div>

        {isLoggedIn && !isLoginOrRegisterPage && (
          <a href="#" className="logoutbtn" onClick={handleLogout}>Logout</a>
        )}
      </div>
      
      <span 
        style={{ fontSize: '30px', cursor: 'pointer', position: 'fixed', top: '10px', left: '10px' }} 
        onClick={openNav}
      >
        &#9776; 
      </span>
    </div>
  );
};

export default Sidenav;
