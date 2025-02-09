import React, { useState, useEffect } from 'react'
import Search from './components/search.jsx'

const API_BASE_URL = 'https://api.themoviedb.org/3' ;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY ;
const API_OPTIONS ={
  method: 'GET',
  headers : {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}




const App = () => {
  const [searchTerm, setSearchTerm] = useState('') ;
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]) ;
  const [isLoading, setIsLoading] = useState(false) ;

  const fetchmovies = async () => {
    setIsLoading(true) ;
    try{
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc` ;

      const response = await fetch(endpoint, API_OPTIONS) ;

      if(!response.ok)
        throw new Error('Failed')
      
      const data = await response.json() ;
      if(data.Response  === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      console.log("data", data)
      console.log("list", movieList);

    } catch(error) {
      console.error(`Error while fetching: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later!') ;
    } finally{
      setIsLoading(false);
    }
  }
  
  useEffect( () => {
    fetchmovies();
  }, []);

  return (
      <main>
        
        <div className='pattern'  />
        
        <div className='wrapper'>
          <header>
            <img src="./hero.png" />
            <h1>Find <span className='text-gradient'>Movies</span> You'll enjoy Without the Hassle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className='all-movies'>
            <h2>All Movies</h2>

            {isLoading ? (
              <p className='text-white'>Loading...</p>
            ): errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ): (
              <ul>
                {movieList.map( (movie) => (
                  <p key={movie.id} className='text-white'>{movie.title}</p>
                ))}
              </ul>
            )}
          </section>
          
        </div>

        
        
      </main>
  )
}

export default App
