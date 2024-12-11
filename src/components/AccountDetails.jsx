import React, { useState, useEffect } from 'react';
import { useWatchlist } from '../components/WatchlistContext';
import { useParams } from 'react-router-dom'

const AccountDetails = () => {
  const { watchlist } = useWatchlist();
  const username = localStorage.getItem('username');
  const [comments, setComments] = useState([]);
  const { userId } = useParams();
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const response = await fetch(`https://codevengers-backend.onrender.com/users/${userId}/comments`);
        console.log(response)
        if (!response.ok) {
          throw new Error('Failed to get comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching user comments:', error);
        setError('Unable to load comments. Please try again later');
      }
    };
    if (userId) {
      fetchUserComments();
    }
  }, [userId]);

  return (
    <>
      <div>
        <h1> Hello {username}</h1>
      </div>

      <div className='user-comments'>
        <h1>Your Comments</h1>
        {comments.length > 0 ? (
          <ul>
            {comments.map((comment) => {
              return (
                <li key={comment.id}>
                  <p>{comment.text}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>You haven't made any comments yet.</p>
        )}
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
