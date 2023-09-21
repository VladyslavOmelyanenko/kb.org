import React from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import Language from "../../hooks/Language";


import styles from './VenueTag.module.scss'


const VenueTag = (props) => {

  const language = Language();
  const { t } = useTranslation();

  
  const venue = props.venue;
  const location = venue?.location.data?.attributes;

  const venueTagImages = {
    "exhibition": "exhibition.png",
    "performance": "performance.png",
    "film program": "film program.png",
    "lecture": "lecture.png",
    "виставка": "виставка.png",
    "перформанс": "перформанс.png",
    "фільмова програма": "фільмова програма.png",
    "лекція": "лекція.png"
  }
  const locationIcon = location.tagIcon?.data?.attributes.url;
  

  
  return (
    <div className={styles.venue}>
      <div className={styles.venueTags}>
        <div>
          <img
            src={"/venueTypeTags/" + venueTagImages[t(venue.venueType)]}
            alt={venue.venueType}
          ></img>
        </div>
        <div>
          {locationIcon && <img src={locationIcon} alt={location.title}></img>}
        </div>
      </div>
      <p className={styles.venuePlaceAndTime}>
        <b>{location.city}</b> <br></br>
        {venue.startDate.split("-")[2] + ", "}
        {
          venue.venueOpeningTime && venue.venueOpeningTime.slice(
            0,
            venue.venueOpeningTime.indexOf(":", 3)
          )}
      </p>
      <h3 className={styles.venueTitle}>
        <Link to={`/${language}/program/${venue.slug}`}>{venue.title}</Link>
      </h3>
      <p>{venue.curators}</p>
    </div>
  );
};

export default VenueTag;