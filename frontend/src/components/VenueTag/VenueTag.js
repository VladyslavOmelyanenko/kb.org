import React from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import Language from "../../hooks/Language";


import styles from './VenueTag.module.scss'


const VenueTag = (props) => {

  const language = Language();
  const { t } = useTranslation();

  
  const venue = props.venue;
  const activeCategory = props.activeCategory;
  console.log(activeCategory);
  const setActiveCategory = props.setActiveCategory;
  const isHighlighted = props.isHighlighted;

  const location = venue?.location.data?.attributes;

  const venueTagImages = {
    "exhibition": "exhibition.png",
    "performance": "performance.png",
    "film program": "film program.png",
    "lecture": "lecture.png",
    "postcard project": "postcard project.png",
    "виставка": "виставка.png",
    "перформанс": "перформанс.png",
    "фільмова програма": "фільмова програма.png",
    "лекція": "лекція.png"
  }
  const locationCity = location?.city.toLowerCase();

  

  
  return (
    <div className={styles.venue} style={
    (activeCategory) 
    ? 
      (isHighlighted)  
      ? {opacity: 1} : {opacity: 0.5} 
    : null}>
      <div className={styles.venueTags}>
        <div>
          <img
            onMouseEnter={() => setActiveCategory(venue.venueType)}
            onMouseLeave={() => setActiveCategory(null)}
            src={"/venueTypeTags/" + venueTagImages[t(venue.venueType)]}
            alt={venue.venueType}
          ></img>
        </div>
        <div>
          <img
            onMouseEnter={() => setActiveCategory(locationCity)}
            onMouseLeave={() => setActiveCategory(null)}
            src={`/cityTags/${locationCity}.png`}
            alt={location.title}
          ></img>
        </div>
      </div>
      <p className={styles.venuePlaceAndTime}>
        <b>{location.locationName}</b> <br></br>
        {venue.startDate.split("-")[2] + ", "}
        {venue.venueOpeningTime &&
          venue.venueOpeningTime.slice(
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