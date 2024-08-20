
import axios from 'axios';

export const registerUser = async (userData) => {
    const response = await fetch('https://chatify-api.up.railway.app/auth/register', {
        method: 'POST', // This line specifies the POST method
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(userData)
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
    
      return response.json(); // Return the response as JSON
    };
