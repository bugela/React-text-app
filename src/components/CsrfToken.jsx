import { useEffect, useRef } from 'react';

const CsrfToken = ({ setCsrfToken }) => {
  const hasFetchedToken = useRef(false);

  useEffect(() => {
    if (hasFetchedToken.current) return; // Exit early if token has already been fetched

    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('https://chatify-api.up.railway.app/csrf', {
          method: 'PATCH', 
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('CSRF Token fetched successfully:', data.csrfToken);
        setCsrfToken(data.csrfToken);
        hasFetchedToken.current = true; // Update ref to indicate token has been fetched
      } catch (err) {
        console.error('Failed to fetch CSRF token:', err);
      }
    };

    fetchCsrfToken();
  }, [setCsrfToken]);

  return null;
};

export default CsrfToken;