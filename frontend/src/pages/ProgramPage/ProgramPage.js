import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {API_URL} from "../../config";
import Language from "../../hooks/Language";
import useFetchData from "../../hooks/useFetchData";

import Navbar from "../../components/Navbar/Navbar";
import VenueTag from "../../components/VenueTag/VenueTag";

import styles from "./ProgramPage.module.scss";

const ProgramPage = () => {

  const [rerender, setRerender] = useState(false);

  const triggerRerender = () => {
    setRerender((prevState) => !prevState);
  };

  const { t } = useTranslation();
  const language = Language();
  const [activeVenues, setActiveVenues] = useState([]);
  const [venuesByCities, setVenuesByCities] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeCity, setActiveCity] = useState("");  


  const data = useFetchData(`${API_URL}/venues`, language);

  const months = ["october", "november", "december", "january"];
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
      "антверпен",
    ];

  useEffect(() => {
    const venues = data && data.data.map((venue) => venue.attributes);


    if (venues) {
      setActiveVenues(venues);
    }

    venues && setVenuesByCities(venues.reduce((result, venue) => {
      const { location } = venue; 
      const city = location.data.attributes.city; 

      if (!result[city]) {
        result[city] = [];
      }

      result[city].push(venue);

      return result;
    }, {}));

    const documentHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--doc-height', `${window.innerHeight}px`);
    };

    window.addEventListener('resize', documentHeight);
    documentHeight();

    return () => {
      window.removeEventListener('resize', documentHeight);
    };

  }, [data, rerender]);
  

  const getDistributedVenuesByMonth = (venues) => {

    const numberToTxtMonths = {
      '10': 'october',
      '11': 'november',
      '12': 'december',
      '01': 'january'
    };

    const distributedVenues = venues.reduce((result, venue) => {
      const startDate = venue.startDate.split("-")[1];
      const finishDate = venue.finishDate && venue.finishDate.split("-")[1];
      const months = [];
      if (finishDate) {
        for (let i = startDate; i <= finishDate; i++) {
          const month = numberToTxtMonths[i];
          months.push(month);
        }
      } else {
        const month = numberToTxtMonths[startDate];
        months.push(month)
      }

      months.forEach((month) => {
        if (!result[month]) {
          result[month] = [];
        }

        result[month].push(venue);
      })

      return result;

    }, {});

    for (const month in numberToTxtMonths) {
      if (!distributedVenues[numberToTxtMonths[month]]) {
        distributedVenues[numberToTxtMonths[month]] = [];
      }
    }
    return distributedVenues;
  }
  
  const sortedVenuesInMonth = (venuesArray) => {
    const compareStartDate = (a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);

      return dateA - dateB;
    }
    return venuesArray.sort(compareStartDate);
  }

  const handleCityButton = (city) => {
    if (activeCity === city) {
      setActiveVenues(Object.values(venuesByCities).flat());
      setActiveCity('');
    } else {
      setActiveVenues(venuesByCities[city]);
      setActiveCity(city);
    }
  }

  return (
    <>
      <Navbar triggerRerender={triggerRerender} />
      <section className={styles.programSection}>
        <ul className={styles.citiesList}>
          {venuesByCities &&
            Object.keys(venuesByCities)
              .sort(
                (a, b) =>
                  orderOfCities.indexOf(a.toLowerCase()) -
                  orderOfCities.indexOf(b.toLowerCase())
              )
              .map((city) => (
                <li key={city} className={styles.city}>
                  <button
                    className={
                      city === activeCity
                        ? `${styles.cityButton} ${styles.activeCityButton}`
                        : `${styles.cityButton}`
                    }
                    onClick={() => handleCityButton(city)}
                  >
                    {city}
                    {city === activeCity ? (
                      <img
                        className={styles.closeCity}
                        src="/closeCity.png"
                        alt="x"
                      ></img>
                    ) : null}
                  </button>
                </li>
              ))}
        </ul>

        <div className={styles.venuesByMonths}>
          {!!activeVenues.length &&
            months.map((month) => (
              <div className={styles.month} key={month}>
                <h5 className={styles.monthTitle}>{t(month)}</h5>
                <div className={styles.monthVenues}>
                  {sortedVenuesInMonth(getDistributedVenuesByMonth(activeVenues)[
                    month
                  ]).map((venue) => (
                    <VenueTag
                      venue={venue}
                      key={venue.title}
                      setActiveCategory={setActiveCategory}
                      activeCategory={activeCategory}
                      enabled={true}
                      isHighlighted={
                        venue.venueType === activeCategory ||
                        venue?.location.data?.attributes.city.toLowerCase() ===
                          activeCategory
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
}

export default ProgramPage;