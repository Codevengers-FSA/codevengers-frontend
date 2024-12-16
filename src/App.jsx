import { Routes, Route } from 'react-router-dom';

import Home from './components/Homepage';
import Navbar from './components/NavBar';
import AllMovies from './components/AllMovies';
import Watchlists from './components/Watchlists';
import MovieDetails from './components/MovieDetails';
import Account from './components/Account';
import AccountDetails from './components/AccountDetails';
import RecommendedMoviesForm from './components/RecommendedMoviesForm';


const App = () => {
  return (
    <>
   
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/moviecatalog" element={<AllMovies />} />
      <Route path="/moviecatalog/:id" element={<MovieDetails />} />
      <Route path="/watchlists" element={<Watchlists />} />
      <Route path="/account" element={<Account />} />
      <Route path="/account-details" element={<AccountDetails />} />
      <Route path="/recommended-movies" element={<RecommendedMoviesForm />} />
    </Routes>
    
    </>
    
  );
};

export default App;