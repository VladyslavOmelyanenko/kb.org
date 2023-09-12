import React from 'react';


import styles from './VenueTag.module.scss'



const VenueTag = (props) => {
  const venue = props.venue;
  console.log(venue);

  //get the location properly
  
  // console.log(venue);
  
  return (
    <div className={styles.venue}>
      <ul className={styles.venueTags}>
        <li>{venue.venueType}</li>
        <li>place</li>
      </ul>
      <p className={styles.venuePlaceAndTime}>
        {/* <b>{venue.location}</b> <br></br> */}
        {venue.dateAndTime}
      </p>
      <h3 className={styles.venueTitle}>{venue.title}</h3>
      <p>{venue.curators}</p>
    </div>
  )
};

export default VenueTag;