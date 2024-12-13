import React, { useState } from "react";

const Home = () => {
  const [movieInput, setMovieInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="homepage-container">
      <h1 >Welcome To Our Marvel Universe</h1>
      <h2 className="homepage-subtitle">Unleash your inner hero (or villain) with our Marvel AI Assistant!</h2>
      <p className="homepage-description">Do you have a question about the marvel universe? Just type anything
      - a name, a movie, a quote. Our Marvel AI assistant will find where it appears 
      in the movies and shows!</p>
      <p className="homepage-description">Ready to begin?</p>
      <h2 className="homepage-section-title">How it works</h2>
      <ol className="homepage-steps">
        <li>Enter your interest!</li>
        <li>Explore the results!</li>
      </ol>
      <form className="homepage-form" onSubmit={handleSubmit}>
        <label className="form-label">
          Enter a movie or character:
          <input
            type="text"
            value={movieInput}
            onChange={(e) => setMovieInput(e.target.value)}
            required
          />
        </label>
        <button className="form-button" type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </form>


      {error && <p style={{ color: "red" }}>{error}</p>}


      {recommendations.length > 0 && (
        <div className="recommendation-container">
          <h3 className="recommendation-title">Recommended Movies:</h3>
          <ul className="recommendation-list">
            {recommendations.map((movie, index) => (
              <li className="recommendation-item" key={index}>{movie} </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;