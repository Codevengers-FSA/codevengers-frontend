import React, { useEffect, useState } from "react";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await fetch("https://codevengers-backend.onrender.com/movies");
        const movieData = await response.json();
        console.log("API Response:", movieData);
  
        if (Array.isArray(movieData)) {
          setMovies(movieData);
        } else {
          console.error("Unexpected API response format:", movieData);
        }
      } catch (e) {
        console.error("Error fetching movies:", e);
      }
    };
  
    getMovies();
  }, []);

  return (
    <>
      <h1>Movie Catalog</h1>
      <section id="all-movies">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <h2>{movie.title}</h2>
              {movie.image ? (
                <img src={movie.image} alt={`${movie.title} Poster`} className="movie-poster" />
              ) : (
                <p>No Image Available</p>
              )}
            </div>
          ))
        ) : (
          <p>Loading movies...</p>
        )}
      </section>
    </>
  );
};

export default AllMovies;