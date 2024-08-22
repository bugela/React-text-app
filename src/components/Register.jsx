import './Register.css'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 




const Register = ({ csrfToken }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState('');
    const [images, setImages] = useState([]);
    const [success, setSuccess] = useState(false);
    
    useEffect(() => {
      setImages(getRandomAvatars());
    }, []);

    /*const getRandomAvatars = () => {
      let randomAvatars = [];
      while (randomAvatars.length < 10) {
        const randomId = Math.floor(Math.random() * 70) + 1; 
        const avatarUrl = `https://i.pravatar.cc/200?img=${randomId}`;
        if (!randomAvatars.includes(avatarUrl)) {
          randomAvatars.push(avatarUrl);
        }
      }
      return randomAvatars;
    };*/

    const getRandomAvatars = () => {
      const generateUniqueIds = (count, max) => {
        const uniqueIds = new Set();
        while (uniqueIds.size < count) {
          uniqueIds.add(Math.floor(Math.random() * max) + 1);
        }
        return Array.from(uniqueIds);
      };
    
      const uniqueIds = generateUniqueIds(10, 70);
      return uniqueIds.map(id => `https://i.pravatar.cc/200?img=${id}`);
    };

    const handleRegister = (e) => {
      e.preventDefault();
      const payload = {
        username,
        password,
        email,
        avatar,
        csrfToken
      };
  
      fetch('https://chatify-api.up.railway.app/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(async res => {
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.message || 'username or email already exists');
          
        }
  
       
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('avatar', avatar);
        navigate('/', { state: { message: 'Registration successful' } });
      })
      .catch(err => setError(err.message));
    };

    const handleChooseAvatar = () => {
      const avatars = getRandomAvatars();
      setImages(avatars);
      setShowAvatarPicker(true);
    };
  
    const handleAvatarClick = (selectedImage) => {
      setAvatar(selectedImage);
      setShowAvatarPicker(false);
    };


    const handleLoginNavigation = () => {
        navigate('/');
      };
  
    return (
      <div>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
            {showAvatarPicker && (
              <div className="avatar-picker">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="avatar"
                    width="90"
                    height="90"
                    onClick={() => handleAvatarClick(image)}
                    className={avatar === image ? 'selected' : ''}
                  />
                ))}
              </div>
            )}

            <button className="buttonavatar" type="button" onClick={handleChooseAvatar}>
              {avatar ? 'Change Avatar' : 'Choose Avatar'}
            </button>

            {avatar && (
              <div>
                <h3>Selected Avatar:</h3>
                <img className='selectedavatar' src={avatar} alt="Selected avatar" width="200" height="200" />
              </div>
            )}

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
  };
  
  export default Register;