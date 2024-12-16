import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useWatchlist } from './WatchlistContext';
import CommentsSection from './CommentsSection';

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToWatchlist, watchlist } = useWatchlist();
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const fetchRatingData = async () => {
    try {
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      const response = await fetch(`https://codevengers-backend.onrender.com/ratings/movies/${id}/ratings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.average !== undefined && data.userRating !== undefined) {
          setAverageRating(data.average);
          setUserRating(data.userRating);
        } else {
          console.error("Invalid rating data format.");
        }
      } else {
        console.error("Failed to fetch ratings.");
      }
    } catch (error) {
      console.error("Error fetching rating data", error);
    }
  };

  useEffect(() => {
    const getSingleMovie = async () => {
      try {
        const response = await fetch(`https://codevengers-backend.onrender.com/movies/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSelectedMovie(data);
      } catch (error) {
        console.error("Error fetching single movie:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSingleMovie();
  }, [id]);

  useEffect(() => {
    fetchRatingData();
  }, [id, token]);

  useEffect(() => {
    const movieInWatchlist = watchlist.some(movie => movie.id === selectedMovie?.id);
    setIsInWatchlist(movieInWatchlist);
  }, [watchlist, selectedMovie]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const commentId = params.get('comment');
    if (commentId) {
      const commentElement = document.getElementById(`comment-${commentId}`);
      if (commentElement) {
        commentElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.search]);

  const handleRatingClick = async (rating) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://codevengers-backend.onrender.com/ratings/movies/${id}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating }),
        }
      );

      if (response.ok) {
        fetchRatingData();
        setUserRating(rating);
      } else {
        console.error("Failed to save user rating.");
      }
    } catch (error) {
      console.error("Error saving rating", error);
    }
  };

  const handleAddToWatchlist = () => {
    addToWatchlist(selectedMovie);
    setIsInWatchlist(true);
  };

  const handleWatched = async () => {
    try {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');

      if (!username || !token) {
        console.error("Username or token is missing.");
        return;
      }

      const response = await fetch(
        `https://codevengers-backend.onrender.com/users/${username}/watched`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ movieId: id }),
        }
      );

      if (response.ok) {
        setIsWatched(true);
      } else {
        console.error("Failed to update watched status.");
      }
    } catch (error) {
      console.error("Error updating watched status", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://codevengers-backend.onrender.com/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSelectedMovie((prevMovie) => ({
          ...prevMovie,
          comments: prevMovie.comments.filter((comment) => comment.id !== commentId),
        }));
      } else {
        console.error("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const deleteReply = async (replyId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://codevengers-backend.onrender.com/comments/replies/${replyId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log(`Reply with ID ${replyId} deleted.`);
      } else {
        console.error("Failed to delete reply.");
      }
    } catch (error) {
      console.error("Error deleting reply.", error);
    }
  };

  if (isLoading) {
    return <p>Loading movie details...</p>;
  }

  if (!selectedMovie) {
    return <p>Movie details not found.</p>;
  }

  return (
    <>
    <div className="movie-details-container">
      {selectedMovie.image && (
        <img
          id="movie-poster"
          src={`https://codevengers-backend.onrender.com${selectedMovie.image}`}
          alt={`Poster for ${selectedMovie.title}`}
          height="500"
          width="350"
        />
      )}
      <h2 id="movie-title">{selectedMovie.title}</h2>
      <p id="movie-summary">{selectedMovie.summary}</p>
      </div>
      <CommentsSection movieId={id} />
      
      <div className="button-container">
      {token && !isInWatchlist && ( 
        <button className="watchlist-button" 
        onClick={handleAddToWatchlist}>Add to Watchlist</button>
      )}


      {isInWatchlist && <p>Added to Watchlist!</p>}


      {token && !isWatched && (
        <button className="watched-button" onClick={handleWatched}>I've Watched This</button>
      )}
      </div>


      {isWatched && <p>You've watched this movie!</p>}


      <div className="rating-container">
        <h3 className="rating-title">Rate This Movie</h3>
        <div >
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                cursor: "pointer",
                color: userRating >= star ? "gold" : "gray",
                fontSize: "24px",
              }}
              onClick={() => handleRatingClick(star)}
            >
              ★
            </span>
          ))}
        </div>
        <p className="average-rating">Current Average Rating: {averageRating.toFixed(1)}</p>
      </div>
    </>
  );
};

export default MovieDetails;