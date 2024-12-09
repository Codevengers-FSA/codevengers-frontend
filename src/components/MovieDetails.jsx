import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWatchlist } from './WatchlistContext';
import CommentsSection from './CommentsSection';

const MovieDetails = () => {
  const { id } = useParams();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToWatchlist } = useWatchlist();

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

  if (isLoading) {
    return <p>Loading movie details...</p>;
  }

  if (!selectedMovie) {
    return <p>Movie details not found.</p>;
  }

  const handleAddToWatchlist = () => {
    addToWatchlist(selectedMovie);
  };

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
    </>
  );
};

export default MovieDetails;