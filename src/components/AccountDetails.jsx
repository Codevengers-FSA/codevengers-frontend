import React from 'react';
import { useWatchlist } from '../components/WatchlistContext';

const AccountDetails = () => {
  const { watchlist } = useWatchlist();

  return (
    <div>
      <h2>Your Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <ul>
          {watchlist.map((movie) => (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <img src={movie.image} alt={`Poster for ${movie.title}`} width="150" />
              <p>{movie.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default AccountDetails;