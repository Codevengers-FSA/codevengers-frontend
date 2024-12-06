import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './components/Homepage';
import Navbar from './components/NavBar';
import AllMovies from './components/AllMovies';
import Watchlists from './components/Watchlists';
import MovieDetails from './components/MovieDetails';
import Account from './components/Account';
import AccountDetails from './components/AccountDetails';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moviecatalog" element={<AllMovies />} />
        <Route path="/moviecatalog/:id" element={<MovieDetails />} />
        <Route path="/watchlists" element={<Watchlists />} />
        <Route path="/login" element={<Account />}/>
        <Route path="/account" element={<AccountDetails />} />
      </Routes>
    </>
  );
};

export default App;
