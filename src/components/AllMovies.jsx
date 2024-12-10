import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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

  // function that filters through the movies 
  const filteredMovies = movies.filter((movie) => {
    return movie.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <h1>Movie Catalog</h1>
      {/* create input  */}
      <div>
        <input
          type="text"
          placeholder="Search for movie"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section id="all-movies">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
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