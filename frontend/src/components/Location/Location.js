import { useTranslation } from "react-i18next";

import VenueTag from "../VenueTag/VenueTag";

import styles from "./Location.module.scss";

const Location = (props) => {
  const { t } = useTranslation();

  const location = props.locationObject;
  const isExpanded = props.isExpanded;

  const locationImage = location.locationImage.data?.attributes;
  const locationLogo = location.cityLogo.data?.attributes;
  const locationVenues = location.venues?.data?.map(
    (locationObj) => locationObj.attributes
  );

  return (
    <div
      className={
        isExpanded
          ? `${styles.location} ${styles.expandedLocation}`
          : `${styles.location}`
      }
    >
      <div className={styles.locationInfo}>
        <h3 className={styles.locationName}>{location.locationName}</h3>
        <p className={styles.locationAddress}>{location.locationAddress}</p>
        <p className={styles.locationHours}>{location.openingHours}</p>
        {isExpanded && (
          <>
            <img
              src={locationImage.url}
              alt={locationImage.name}
              className={styles.locationImage}
            ></img>
            <p className={styles.locationDescription}>
              {location.locationDescription}
            </p>
          </>
        )}
      </div>
      {isExpanded && (
        <div className={styles.locationSideInfo}>
          {locationLogo && (
            <img src={locationLogo.url} alt={locationLogo.name}></img>
          )}
          <h4>{t("program")}</h4>
          <div className={styles.locationVenues}>
            {locationVenues.map((venue, i) => (
              <VenueTag venue={venue} key={i}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Location;
