import './Register.css'
import React, { useState } from 'react';
import { registerUser } from './api/Service.jsx';
import { useNavigate } from 'react-router-dom'; 


function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState('');
    const [csrfToken, setCsrfToken] = useState('dummyCsrfToken'); // Replace with real CSRF token if available
  
    const handleRegister = async (e) => {
      e.preventDefault();
      setError(null); // Clear previous errors
  
      const userData = {
        username,
        email,
        password,
      };
  
      try {
        const response = await registerUser(userData);
        console.log('Registration successful:', response);
        setSuccess(true);
      } catch (err) {
        setError(err.message);
        setSuccess(false);
      }
    };

    const handleLoginNavigation = () => {
        navigate('/');
      };
  
    return (
      <div>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Register</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Registration successful!</p>}

        <button onClick={handleLoginNavigation}>Back to Login</button>
      </div>
    );
  }
  
  export default Register;