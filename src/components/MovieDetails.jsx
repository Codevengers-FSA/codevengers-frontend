import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWatchlist } from './WatchlistContext';
import CommentsSection from './CommentsSection';

const MovieDetails = () => {
  const { id } = useParams();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToWatchlist } = useWatchlist();
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0)

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

  const fetchRatingData = async () => {
    try {
      const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);

        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }
  
        const response = await fetch('https://codevengers-backend.onrender.com/ratings/movies/2/rate', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating: 4 }),
          }
        );
  
        if (response.ok) {
            const data = await response.json();
            setAverageRating(data.average);
            setUserRating(data.userRating || 0);
        } else {
            console.error("Failed to fetch rating data.");
        }
    } catch (error) {
        console.error("Error fetching rating data", error);
    }
};

  useEffect(() => {
    fetchRatingData();
  }, [id]);

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
  };

  if (isLoading) {
    return <p>Loading movie details...</p>;
  }

  if (!selectedMovie) {
    return <p>Movie details not found.</p>;
  }

  return (
    <>
      {selectedMovie.image && (
        <img
          id="movie-poster"
          src={selectedMovie.image}
          alt={`Poster for ${selectedMovie.title}`}
          height="500"
          width="350"
        />
      )}
      <h2 id="movie-title">{selectedMovie.title}</h2>
      <p id="movie-summary">{selectedMovie.summary}</p>
      <CommentsSection movieId={id} />
      
      <button onClick={handleAddToWatchlist}>Add to Watchlist</button>

      <div>
        <h3>Rate This Movie</h3>
        <div>
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
        <p>Current Average Rating: {averageRating.toFixed(1)}</p>
      </div>
    </>
  );
};

export default MovieDetails;