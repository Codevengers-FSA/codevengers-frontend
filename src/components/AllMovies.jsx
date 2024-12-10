import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await fetch("https://codevengers-backend.onrender.com/movies");
        const movieData = await response.json();
        console.log("API Response:", movieData);
  
        if (Array.isArray(movieData)) {
          setMovies(movieData);
          const sortedMovies = movieData.sort((a, b) => a.id - b.id);
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
            <section
              onClick={() => {
                navigate(`/moviecatalog/${movie.id}`);
              }}
              key={movie.id}
              style={{ cursor: 'pointer' }}
            >
              <h3>{movie.title}</h3>
              {movie.image ? (
                <img
                  src={movie.image}
                  alt={`${movie.title} Poster`}
                  height="350"
                  width="250"
                />
              ) : (
                <p>No Image Available</p>
              )}
            </section>
          ))
        ) : (
          <p>Loading movies...</p>
        )}
      </section>
    </>
  );
};

export default AllMovies;