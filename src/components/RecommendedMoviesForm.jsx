import React, { useState } from "react";

const RecommendMoviesForm = () => {
  const [movieInput, setMovieInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
        const response = await fetch("https://codevengers-backend.onrender.com/ai-movies/recommend-movies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ movieInput }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        setRecommendations(data.recommendations);
    } catch (error) {
        setError("Error fetching recommendations.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div>
      <h2>Get Movie Recommendations</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a movie or character:
          <input
            type="text"
            value={movieInput}
            onChange={(e) => setMovieInput(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {recommendations.length > 0 && (
        <div>
          <h3>Recommended Movies:</h3>
          <ul>
            {recommendations.map((movie, index) => (
              <li key={index}>{movie}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecommendMoviesForm;