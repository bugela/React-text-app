import './Login.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CsrfToken from './CsrfToken';
import { jwtDecode } from 'jwt-decode';

const Login = ({ setToken, setUserId, csrfToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const loginData = {
      username,
      password,
      csrfToken,
    };

    try {
      const response = await fetch( 'https://chatify-api.up.railway.app/auth/token' , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Login failed: ${response.statusText}`);
      }


      const data = await response.json();
      const { token } = data;
      const decodedToken = parseJwt(token);
      const { id: userId, user, avatar, email, invite } = decodedToken;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', user);
      localStorage.setItem('avatar', avatar);
      localStorage.setItem('email', email);
      localStorage.setItem('invite', invite);

      setToken(token);
      setUserId(userId);
      setSuccess('Login successful');

      setTimeout(() => {
        navigate('/chat');
      }, 1000);

    } catch (err) {
      console.error('Failed to login:', err);
      setError('Invalid credentials');
    }
  };

  const parseJwt = (token) => {
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error('Invalid token', e);
      return {};
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit" className="login-button">Login</button>
          <button type="button" onClick={() => navigate('/register')} className="register-button">Register</button>
        </div>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
      </div>
    </div>
  );
}

export default Login;
