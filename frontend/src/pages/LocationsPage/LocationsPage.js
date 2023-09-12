import React from 'react';
import { useState, useEffect } from 'react';


import { API_URL } from "../../config";
import Language from "../../hooks/Language";
import useFetchData from "../../hooks/useFetchData";

import Navbar from "../../components/Navbar/Navbar";
import Footer from '../../components/Footer/Footer';
import Location from '../../components/Location/Location';

import styles from './LocationsPage.module.scss';

const LocationsPage = () => {


  const language = Language();
  const data = useFetchData(`${API_URL}/locations`, language, '', ['locationImage', 'locationLogo', 'venues']);
  const locations = data && data.data.map((location) => location.attributes);
  
  const [locationsByCity, setLocationsByCity] = useState({});

  useEffect(() => {
  if (locations && Object.keys(locationsByCity).length === 0) {
    const locationsMappedByCity = locations.reduce((obj, item) => {
      obj[item.city] = obj[item.city] ? [...obj[item.city], item] : [item];
      return obj;
    }, {});
    setLocationsByCity(locationsMappedByCity);
  }
}, [locations, locationsByCity]);


  const expandCity = (city) => {
  setLocationsByCity(prevLocationsByCity => {
    const updatedLocations = { ...prevLocationsByCity };
    Object.entries(updatedLocations).forEach(([key, value]) => {
      updatedLocations[key] = value.map(location => ({ ...location, expanded: false }));
    });
    updatedLocations[city] = updatedLocations[city].map(location => ({ ...location, expanded: true }));
    return updatedLocations;
  });
}

  return (
    <>
      <Navbar />
      <div className={styles.cities}>
        {locationsByCity && Object.entries(locationsByCity).map(([city, locations], i) => (
          <div className={(locations[0].expanded) ? `${styles.city} ${styles.expandedCity}` : `${styles.city}`} key={i} onClick={ () => expandCity(city) }>
            {locations.map((location, i) => (
              <Location locationObject={location} key={i}/>
            ))}
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}

export default LocationsPage;