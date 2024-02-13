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


  const data = useFetchData(`${API_URL}/venues`, language, "", ["locations"]);

  const months = ["october", "november", "december", "january", "february", "march", "april", "may", "june", "july", "august"].reverse();

  const orderOfCities = [
    "berlin",
    "kyiv",
    "ivano-frankivsk",
    "uzhhorod",
    "vienna",
    "warsaw",
    "lublin",
    "antwerp",
    "берлін",
    "київ",
    "івано-франківськ",
    "ужгород",
    "відень",
    "варшава",
    "люблін",
    "антверпен"
  ];
  const txtToNumberMonth = {
    october: 10,
    november: 11,
    decembuary: 12,
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
  };

  useEffect(() => {
    const venues = data && data.data.map((venue) => venue.attributes);


    if (venues) {
      setActiveVenues(venues);
    }

    venues && setVenuesByCities(venues.reduce((result, venue) => {
      const { locations } = venue; 
      const city = locations.data[0].attributes.city; 

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
      '01': 'january',
      '02': 'february',
      '03': 'march',
      '04': 'april',
      '05': 'may',
      '06': 'june',
      '07': 'july',
      '08': 'august',
    };

    

    const distributedVenues = venues.reduce((result, venue) => {
      const startDate = venue.startDate.split("-")[1];
      const finishDate = venue.finishDate && venue.finishDate.split("-")[1];
      const months = [];
      if (finishDate) {
        if (finishDate === '01') {
           for (let i = startDate; i <= 12; i++) {
            const month = numberToTxtMonths[i];
            months.push(month);
           }
           months.push(numberToTxtMonths[finishDate]);
          } else {
            for (let i = +startDate; i <= finishDate; i++) {
            const index = i < 10 ? `0${i}` : i;
              const month = numberToTxtMonths[index];
              months.push(month);
            }
          }
      } else {
        const month = numberToTxtMonths[startDate];
        months.push(month);
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

      return dateB - dateA;
    }
    return venuesArray.sort(compareStartDate);
  }

  const handleCityButton = (city) => {
    console.log(Object.entries(getDistributedVenuesByMonth(venuesByCities[city])));
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
              .map((city, i) => (
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
            months.map((month) => {
              const twentyFourMonth = !activeCity && Object.entries(getDistributedVenuesByMonth(activeVenues))
                .filter(([key,value]) => (value.length !== 0) && (txtToNumberMonth[key] < 10))
                .sort(([key1, value1], [key2, value2]) => key2 - key1)
                .reverse()[0][0];
              return sortedVenuesInMonth(
                getDistributedVenuesByMonth(activeVenues)[month]
              ).length !== 0 ? (
                <div className={styles.month} key={month}>
                  <h5 className={styles.monthTitle}>
                    {[month === "december" ? "’23 " : ((month === twentyFourMonth) ? '’24 ' : ""), t(month)].join("")}
                  </h5>
                  <div className={styles.monthVenues}>
                    {sortedVenuesInMonth(
                      getDistributedVenuesByMonth(activeVenues)[month]
                    ).map((venue, i) => (
                      <VenueTag
                        venue={venue}
                        key={venue.title + i}
                        setActiveCategory={setActiveCategory}
                        activeCategory={activeCategory}
                        enabled={true}
                        isHighlighted={
                          venue.venueType === activeCategory ||
                          venue?.locations.data[0].attributes.city.toLowerCase() ===
                            activeCategory
                        }
                      />
                    ))}
                  </div>
                </div>
              ) : null
          })}
        </div>
      </section>
    </>
  );
}

export default ProgramPage;