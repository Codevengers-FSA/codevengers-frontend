import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Watchlists = () => {
  const [movies, setMovies] = useState([]);
  const [chronologicalMovies, setChronologicalMovies] = useState([]);
  const [releaseDateMovies, setReleaseDateMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
 

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("https://codevengers-backend.onrender.com/movies");
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        
        const data = await response.json();
        setMovies(data);

        const chronological = [...data].sort((a, b) => a.chronologicalOrder - b.chronologicalOrder);
        const releaseDate = [...data].sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        setChronologicalMovies(chronological);
        setReleaseDateMovies(releaseDate);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (isLoading) {
    return <p>Loading movies...</p>;
  }

  return (
    <div className="container">
      <div className="list-section">
        <h2 className="list-title">Timeline Order</h2>
        <ul className="movie-list">
          {chronologicalMovies.map((movie) => (
            <li key={movie.id}
            className="movie-item"
            onClick={() => navigate(`/moviecatalog/${movie.id}`)}>
              <strong className="movie-title">{movie.title}</strong> - Order: {movie.chronologicalOrder}
            </li>
          ))}
        </ul>
      </div>

      <div className="list-section">
        <h2 className="list-title">Release Date Order</h2>
        <ul className="movie-list">
          {releaseDateMovies.map((movie) => (
            <li key={movie.id}
            className="movie-item"
            onClick={() => navigate(`/moviecatalog/${movie.id}`)}>
              <strong className="movie-title">{movie.title}</strong> - Release Date: {new Date(movie.releaseDate).toDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Watchlists;