import React, { useState, useEffect } from 'react';
import { useWatchlist } from '../components/WatchlistContext';
import { useNavigate } from 'react-router-dom';

const AccountDetails = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const username = localStorage.getItem('username');
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = parseJwt(token);
          setUserId(decodedToken.id);
        } else {
          throw new Error('No token found');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setError('Unable to fetch user details. Please try again later.');
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        if (!userId || !username) {
          console.log('User ID or username not set yet');
          return;
        }
        const token = localStorage.getItem('token');
        const response = await fetch(`https://codevengers-backend.onrender.com/users/${username}/comments`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to get comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching user comments:', error);
        setError('Unable to load comments. Please try again later.');
      }
    };

    fetchUserComments();
  }, [userId, username]);

  const handleGoToComment = (movieId, commentId) => {
    navigate(`/moviecatalog/${movieId}`);
  };

  return (
    <>
      <div className="user-profile-container">
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


      <div className="watchlist">
        <h2>Your Watchlist</h2>
        {watchlist.length === 0 ? (
          <p className="empty">Your watchlist is empty.</p>
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