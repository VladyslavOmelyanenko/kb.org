import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";


import { API_URL } from "../../config";
import Language from "../../hooks/Language";
import useFetchData from "../../hooks/useFetchData";

import Navbar from "../../components/Navbar/Navbar";
import Location from '../../components/Location/Location';

import styles from './LocationsPage.module.scss';

const LocationsPage = () => {

  const language = Language();
  const [locationsByCity, setLocationsByCity] = useState({});
  const navigate = useNavigate();
  const {cityParam} = useParams();
  const [activeCity, setActiveCity] = useState(cityParam);

  const orderOfCities = [
    "kyiv",
    "ivano-frankivsk",
    "uzhhorod",
    "vienna",
    "warsaw",
    "lublin",
    "antwerp",
    "київ",
    "івано-франківськ",
    "ужгород",
    "відень",
    "варшава",
    "люблін",
    "антверп",
  ];
  const numberOfCities = 7;
  const citiesContainer = useRef(null);
  const activeCityBlock = useRef(null);
  const [isMobile, setIsMobile] = useState(false);


  const data = useFetchData(`${API_URL}/locations`, language);  

  useEffect(() => {
    const locations = data && data.data.map((location) => location.attributes);

    locations &&
      setLocationsByCity(
        locations.reduce((obj, item) => {
          obj[item.city] = obj[item.city] ? [...obj[item.city], item] : [item];
          return obj;
        }, {})
      );

    setActiveCity(cityParam);

   const handleResizing = () => {
     if (activeCityBlock.current && citiesContainer.current) {
       const rect = activeCityBlock.current.getBoundingClientRect();
       const containerRect = citiesContainer.current.getBoundingClientRect();

       const scrollLeft =
         rect.left - containerRect.left + citiesContainer.current.scrollLeft;

       citiesContainer.current.scrollLeft = scrollLeft - 80;
     }
   };

   const resizeObserver = new ResizeObserver(handleResizing);

   if (activeCityBlock.current) {
     resizeObserver.observe(activeCityBlock.current);
   }


    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();

    const documentHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
    };
    documentHeight();

    window.addEventListener("resize", handleResize);
    window.addEventListener("resize", documentHeight);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", documentHeight);
     resizeObserver.disconnect();

    };
  }, [data, cityParam]);

  const getEnglishCity = (city) => {
    if (orderOfCities.indexOf(city) > (numberOfCities - 1)) {
      return orderOfCities[orderOfCities.indexOf(city) - numberOfCities];
    } else {
      return city;
    }
  }


  const expandCity = (city) => {
    const engCity = getEnglishCity(city.toLowerCase());
    navigate(`/${language}/locations/${engCity}`)
  }

  const setClosestCity = (side, city) => {
    const cityIndex = orderOfCities.indexOf(city.toLowerCase());
    if (side === 'right') {
      if (cityIndex === orderOfCities.length - 1) return;
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
            .sort(
              ([city, locations], [city2, locations2]) =>
                orderOfCities.indexOf(city.toLowerCase()) -
                orderOfCities.indexOf(city2.toLowerCase())
            )
            .map(([city, locations], i) => (
              <div
                key={i}
                className={
                  activeCity &&
                  getEnglishCity(city).toLowerCase() ===
                    activeCity.toLowerCase()
                    ? `${styles.city} ${styles.activeCity}`
                    : `${styles.city}`
                }
                ref={
                  activeCity &&
                  getEnglishCity(city).toLowerCase() ===
                    activeCity.toLowerCase()
                    ? activeCityBlock
                    : null
                }
                onClick={() => expandCity(city)}
              >
                <div className={styles.cityNameLogo}>
                  <h2 className={styles.cityName}>{city}</h2>
                  {activeCity &&
                    getEnglishCity(city).toLowerCase() ===
                      activeCity.toLowerCase() && (
                      <div className={styles.cityLogoContainer}>
                        <img
                          src={`/cities/${getEnglishCity(city)}.png`}
                          alt={city}
                          className={styles.cityLogo}
                        ></img>
                      </div>
                    )}
                </div>
                <div className={`${styles.locations}`} key={i}>
                  {locations.map((location, i) => (
                    <Location
                      locationObject={location}
                      key={i}
                      isExpanded={
                        activeCity &&
                        getEnglishCity(city).toLowerCase() ===
                          activeCity.toLowerCase()
                          ? true
                          : false
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
        {activeCity && !isMobile && (
          <>
            <button
              className={styles.wire + " " + styles.leftWire}
              onClick={() => setClosestCity("left", activeCity)}
            >
              <img src="/left-wire.png" alt="left city"></img>
            </button>
            <button
              className={styles.wire + " " + styles.rightWire}
              onClick={() => setClosestCity("right", activeCity)}
            >
              <img src="/right-wire.png" alt="right city"></img>
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default LocationsPage;