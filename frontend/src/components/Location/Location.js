import styles from './Location.module.scss';
import VenueTag from '../VenueTag/VenueTag';

const Location = (props) => {
  const location = props.locationObject;
  const isExpanded = props.isExpanded;
  const cityLogo = props.cityLogo;

  const locationImage = location.locationImage.data?.attributes;
  const locationLogo = location.cityLogo.data?.attributes;
  const locationVenues = location.venues?.data?.map((locationObj) => locationObj.attributes);


  return (
    <div className={ (isExpanded) ? `${styles.location} ${styles.expandedLocation}` : `${styles.location}`}>
      <div className={styles.locationInfo}>
        <h3 className={styles.locationName}>{location.locationName}</h3>
        <p className={styles.locationAddress}>{location.locationAddress}</p>
        <p className={styles.locationHours}>{location.openingHours}</p>
        <img src={locationImage.url} alt={locationImage.name} className={styles.locationImage}></img>
        {isExpanded && (
          <p className={styles.locationDescription}>{location.locationDescription}</p>
        )}
      </div>
      {isExpanded && (
        <div className={styles.locationSideInfo}>
            {cityLogo && <img className={styles.cityLogo} src={cityLogo} alt={cityLogo}></img>}
            {locationLogo && <img src={locationLogo.url} alt={locationLogo.name}></img>}
            <h4>Program</h4>
            <div className={styles.locationVenues}>
              {locationVenues.map((venue) => <VenueTag venue={venue}/>) }
            </div>
        </div>
      )}
    </div>
  )
}

export default Location;