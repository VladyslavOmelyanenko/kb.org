import styles from './Location.module.scss';
import VenueTag from '../VenueTag/VenueTag';

const Location = (props) => {
  const location = props.locationObject;
  const locationImage = location.locationImage.data.attributes;
  const locationLogo = location.cityLogo.data && location.cityLogo.data.attributes;
  const locationVenue = !!location.venues.data.length && location.venues.data[0].attributes;
  locationVenue && console.log(locationVenue)
  // console.log(location);

  return (
    <div className={ (location.expanded) ? `${styles.location} ${styles.expandedLocation}` : `${styles.location}`}>
      <div className={styles.locationInfo}>
        <h3 className={styles.locationName}>{location.locationName}</h3>
        <p className={styles.locationAddress}>{location.locationAddress}</p>
        <h4 className={styles.locationHoursTitle}>Opening hours</h4>
        <p className={styles.locationHours}>{location.openingHours}</p>
        <img src={locationImage.url} alt={locationImage.name} className={styles.locationImage}></img>
        {location.expanded && (
          <p>{location.locationDescription}</p>
        )}
      </div>
      {location.expanded && (
        <div className={styles.locationSideInfo}>
            {locationLogo && <img src={locationLogo.url} alt={locationLogo.name}></img>}
            <h4>Program</h4>
            {locationVenue && <VenueTag venue={locationVenue}/>}
        </div>
      )}
    </div>
  )
}

export default Location;