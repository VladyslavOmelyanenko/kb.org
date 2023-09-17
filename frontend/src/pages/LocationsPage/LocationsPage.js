import React from 'react';
import { useState, useEffect } from 'react';


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


  const data = useFetchData(`${API_URL}/locations`, language);
  

  useEffect(() => {
  const locations = data && data.data.map((location) => location.attributes);

  locations &&  setLocationsByCity(locations.reduce((obj, item) => {
      obj[item.city] = obj[item.city] ? [...obj[item.city], item] : [item];
      return obj;
    }, {}));

  
}, [data]);


  const expandCity = (city) => {
    setActiveCity(city);
  }

  return (
    <>
      <Navbar />
      <div className={styles.cities}>
        {locationsByCity && 
          Object.entries(locationsByCity)
          .sort(([city, locations], [city2, locations2]) => orderOfCities.indexOf(city.toLowerCase()) - orderOfCities.indexOf(city2.toLowerCase()))
          .map(([city, locations], i) => (
            <div className={(city === activeCity) ? `${styles.city} ${styles.activeCity}` : `${styles.city}`}>
              <h2 className={styles.cityName}>{city}</h2>
              <div className={ `${styles.locations}`} key={i} onClick={ () => expandCity(city) }>
                {locations.map((location, i) => (
                  <Location locationObject={location} key={i} isExpanded={(city === activeCity) ? true : false}/>
                ))}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default LocationsPage;