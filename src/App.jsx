import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './components/Homepage';
import Navbar from './components/NavBar';
import AllMovies from './components/AllMovies';
import Watchlists from './components/Watchlists';
import MovieDetails from './components/MovieDetails';
import LogInForm from './components/LogInForm';

const App = () => {
  return (
    <>
      <h1>React is Running!</h1>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moviecatalog" element={<AllMovies />} />
        <Route path="/moviecatalog/:id" element={<MovieDetails />} />
        <Route path="/watchlists" element={<Watchlists />} />
        <Route path="/login" element={<LogInForm />}/>
      </Routes>
    </>
  );
};

export default App;
