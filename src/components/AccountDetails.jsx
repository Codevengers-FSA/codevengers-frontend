import React, { useState, useEffect } from 'react';
import { useWatchlist } from '../components/WatchlistContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Account from './Account';

const AccountDetails = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const username = localStorage.getItem('username');
  const [comments, setComments] = useState([]);
  const [watchedMovieIds, setWatchedMovieIds] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Decode JWT to extract user info
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
        navigate('/account', { replace: true });
      }
    };
    fetchUserId();
  }, [navigate]);

  useEffect(() => {
    if (!userId || !username) {
      console.log('User ID or username not set yet');
      return;
    }

    const fetchUserComments = async () => {
      try {
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

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://codevengers-backend.onrender.com/users/${username}/watched`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to get watched movies');
        }
        const data = await response.json();
        setWatchedMovieIds(data);
      } catch (error) {
        console.error('Error fetching watched movies:', error);
        setError('Unable to load watched movies. Please try again later.');
      }
    };

    fetchWatchedMovies();
  }, [username]);

  useEffect(() => {
    const fetchMovieDetails = async (movieId) => {
      try {
        const response = await fetch(`https://codevengers-backend.onrender.com/movies/${movieId}`);
        if (!response.ok) {
          throw new Error('Failed to get movie details');
        }
        const movie = await response.json();
        return movie;
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    const loadWatchedMovies = async () => {
      const movies = await Promise.all(watchedMovieIds.map(id => fetchMovieDetails(id)));
      setWatchedMovies(movies);
    };

    if (watchedMovieIds.length > 0) {
      loadWatchedMovies();
    }
  }, [watchedMovieIds]);

  const handleGoToComment = (movieId, commentId) => {
    navigate(`/moviecatalog/${movieId}`);
  };

  const removeFromWatchedMovies = async (movieId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://codevengers-backend.onrender.com/users/${username}/watched/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove from watched movies');
      }

      setWatchedMovieIds(prevIds => prevIds.filter(id => id !== movieId));
      setWatchedMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing from watched movies:', error);
      setError('Unable to remove movie from watched list. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setComments([]);
    setWatchedMovieIds([]);
    setWatchedMovies([]);
    setError(null);
    navigate('/account');
  };

  const loggedIn = !!localStorage.getItem('token'); // Check if user is logged in

  if (!loggedIn) {
    return <Account />;
  }

  return (
    <>
      <div className="user-profile-container">
        <h1>Hello {username}</h1>
      </div>

      <div className="columns-container">
        <div className="column user-comments">
          <h2>Your Comments</h2>
          {error ? (
            <p>{error}</p>
          ) : comments.length > 0 ? (
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>
                  <p>{comment.text}</p>
                  <button className="account-details-button" onClick={() => handleGoToComment(comment.movieId, comment.id)}>Go to Comment</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't made any comments yet.</p>
          )}
        </div>

        <div className="column watchlist">
          <h2>Your Watched Movies</h2>
          {watchedMovies.length === 0 ? (
            <p className="empty">You haven't watched any movies yet.</p>
          ) : (
            <ul>
              {watchedMovies.map((movie) => (
                <li key={movie.id}>
                  <h3>{movie.title}</h3>
                  <img src={`https://codevengers-backend.onrender.com/${movie.image}`} alt={`Poster for ${movie.title}`} width="150" />
                  <button className="account-details-button" onClick={() => removeFromWatchedMovies(movie.id)}>Remove from Watched Movies</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="column watchlist">
          <h2>Your Watchlist</h2>
          {watchlist.length === 0 ? (
            <p>Your watchlist is empty.</p>
          ) : (
            <ul>
              {watchlist.map((movie) => (
                <li key={movie.id}>
                  <h3>{movie.title}</h3>
                  <img src={`https://codevengers-backend.onrender.com/${movie.image}`} alt={`Poster for ${movie.title}`} width="150" />
                  <button className="account-details-button" onClick={() => removeFromWatchlist(movie.id)}>Remove from Watchlist</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountDetails;
