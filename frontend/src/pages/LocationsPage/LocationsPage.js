import React from 'react';
import { useState, useEffect, useRef } from 'react';


import { API_URL } from "../../config";
import Language from "../../hooks/Language";
import useFetchData from "../../hooks/useFetchData";

import Navbar from "../../components/Navbar/Navbar";
import Location from '../../components/Location/Location';

import styles from './LocationsPage.module.scss';

const LocationsPage = () => {


  const language = Language();
  const [locationsByCity, setLocationsByCity] = useState({});
  const [activeCity, setActiveCity] = useState(null);
  const orderOfCities = ['kyiv', 'ivano-frankivsk', 'uzhhorod', 'vienna', 'warsaw', 'lublin'];
  const citiesContainer = useRef(null);
  const activeCityBlock = useRef(null);


  const data = useFetchData(`${API_URL}/locations`, language);
  

  useEffect(() => {
  const locations = data && data.data.map((location) => location.attributes);

  locations &&  setLocationsByCity(locations.reduce((obj, item) => {
      obj[item.city] = obj[item.city] ? [...obj[item.city], item] : [item];
      return obj;
    }, {}));

  
}, [data]);


  const expandCity = (city) => {
    console.log(city);
    setActiveCity(city);
  }

  const setClosestCity = (side, city) => {
    const cityIndex = orderOfCities.indexOf(city.toLowerCase());
    // console.log(citiesContainer.current);
    // console.log(activeCityBlock.current);
    if (side === 'right') {
      if (cityIndex === orderOfCities.length - 1) ;
      console.log(cityIndex);
      const closestCity = orderOfCities[cityIndex + 1];
      expandCity(closestCity.toLowerCase());
      console.log(closestCity.toLowerCase());
      const posLeft = activeCityBlock.current.getBoundingClientRect().left;
      citiesContainer.current.scrollLeft += posLeft;
    } else {
      if (cityIndex === 0) return;
      const closestCity = orderOfCities[cityIndex - 1];
      expandCity(closestCity.toLowerCase());
      console.log(closestCity.toLowerCase());
      const posLeft = activeCityBlock.current.getBoundingClientRect().left;
      citiesContainer.current.scrollLeft -= posLeft;

    }

  }

  return (
    <>
      <Navbar />
      <div className={styles.cities} ref={citiesContainer}>
        {locationsByCity && 
          Object.entries(locationsByCity)
          .sort(([city, locations], [city2, locations2]) => orderOfCities.indexOf(city.toLowerCase()) - orderOfCities.indexOf(city2.toLowerCase()))
          .map(([city, locations], i) => (
            <div className={activeCity && (city.toLowerCase() === activeCity.toLowerCase() ) ? `${styles.city} ${styles.activeCity}` : `${styles.city}`} ref={activeCity && (city.toLowerCase() === activeCity.toLowerCase()) ? activeCityBlock : null}>
              <h2 className={styles.cityName}>{city}</h2>
              <div className={ `${styles.locations}`} key={i} onClick={ () => expandCity(city) }>
                {locations.map((location, i) => (
                  <Location locationObject={location} key={i} isExpanded={activeCity && (city.toLowerCase() === activeCity.toLowerCase()) ? true : false}/>
                ))}
              </div>
            </div>
          ))}
        {activeCity && (
          <>
            <button className={styles.wire + ' ' + styles.leftWire} onClick={() => setClosestCity('left', activeCity)}><img src="/left-wire.png" alt='left city'></img></button>
            <button className={styles.wire + ' ' + styles.rightWire} onClick={() => setClosestCity('right', activeCity)}><img src="/right-wire.png" alt='right city'></img></button>
          </>
        )}
      </div>
    </>
  );
}

export default LocationsPage;