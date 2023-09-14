import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {API_URL} from "../../config";
import Language from "../../hooks/Language";
import useFetchData from "../../hooks/useFetchData";

import Navbar from "../../components/Navbar/Navbar";
import VenueTag from "../../components/VenueTag/VenueTag";

import styles from "./ProgramPage.module.scss";

const ProgramPage = () => {

  const { t } = useTranslation();
  const language = Language();
  const [activeVenues, setActiveVenues] = useState([]);
  const [venuesByCities, setVenuesByCities] = useState({});

  const data = useFetchData(`${API_URL}/venues`, language);



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

  }, [data]);
  


  const getDistributedVenuesByMonth = (venues) => {

    const numberToTxtMonths = {
      '10': 'october',
      '11': 'november',
      '12': 'december',
      '01': 'january'
    };

    const distributedVenues = venues.reduce((result, venue) => {
      const { startDate } = venue;
      const month = numberToTxtMonths[startDate.split('-')[1]]; 

      if (!result[month]) {
        result[month] = [];
      }

      result[month].push(venue);

      return result;

    }, {});
    
    return distributedVenues;
  } 


  return (
    <>
      <Navbar />
      <section className={styles.programSection}>
      <ul className={styles.citiesList}>
        { venuesByCities && Object.keys(venuesByCities).map(city =>( 
          <li key={city} className={styles.city}>
            <button className={styles.cityButton}>{city}</button>
          </li>
        ))}
      </ul>
      <div className={styles.venuesByMonths}>
        {activeVenues && Object.entries(getDistributedVenuesByMonth(activeVenues)).map(([month, venues]) => (
          <div className={styles.month} key={month}>
            <h5 className={styles.monthTitle}>{t(month)}</h5>
            <div className={styles.monthVenues}>
              {venues.map((venue) => <VenueTag venue={venue} key={venue.title}/>)}
            </div>
          </div>
        ))}
      </div>
      </section>
    </>
  );
}

export default ProgramPage;