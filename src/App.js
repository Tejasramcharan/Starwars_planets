
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const App = () => {
  const [planets, setPlanets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentResidents, setCurrentResidents] = useState([]);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await axios.get(`https://swapi.dev/api/planets/?format=json&page=${currentPage}`);
        setPlanets(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10)); 
      } catch (error) {
        console.error('Error fetching planets:', error);
      }
    };

    fetchPlanets();
  }, [currentPage]);

  const fetchResidents = async (residentURLs) => {
    const residentsPromises = residentURLs.map(url => axios.get(url));
    const residentsData = await Promise.all(residentsPromises);
    return residentsData.map(resident => resident.data);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePlanetSelection = async (residentURLs) => {
    const residents = await fetchResidents(residentURLs);
    setCurrentResidents(residents);
  };

  return (
    <div className="app">
      <h1>Star Wars Planets Directory</h1>
      {planets.map(planet => (
        <div key={planet.name} className="planet-card">
         
          <h2>{planet.name}</h2>
          <p>Climate: {planet.climate}</p>
          <p>Population: {planet.population}</p>
          <p>Terrain: {planet.terrain}</p>
          <h3>Residents:</h3>
          <ul>
            {planet.residents.length > 0 ? (
              <button onClick={() => handlePlanetSelection(planet.residents)}>
                Show Residents
              </button>
            ) : (
              <p>No residents found</p>
            )}
          </ul>
          {currentResidents.length > 0 && (
            <ul>
              {currentResidents.map(resident => (
                <li key={resident.name}>
                  <p>Name: {resident.name}</p>
                  <p>Height: {resident.height}</p>
                  <p>Mass: {resident.mass}</p>
                  <p>Gender: {resident.gender}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
          <button key={page} onClick={() => handlePageChange(page)}>{page}</button>
        ))}
      </div>
    </div>
  );
};

export default App;



