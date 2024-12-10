import React, { useState } from 'react';
import { useWatchlist } from '../components/WatchlistContext';

const AccountDetails = () => {
  const { watchlist } = useWatchlist();
  const username = localStorage.getItem('username');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const response = await fetch('https://codevengers-backend.onrender.com/users/${userId}/comments');
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching user comments:', error);
      }
    };
    fetchUserComments();
  }, [userId]);

  return (
    <>
  <div>
    <h1> Hello {username}</h1>
  </div>
    <div>
      <h2>Your Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <ul>
          {watchlist.map((movie) => (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <img src={movie.image} alt={`Poster for ${movie.title}`} width="150" />
              <p>{movie.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
};


export default AccountDetails;