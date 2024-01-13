import { useRef, useEffect, useState } from "react";
import { Link, useParams,  } from "react-router-dom";

import {API_URL} from "../../config";
import { useTranslation } from 'react-i18next';
import useFetchData from "../../hooks/useFetchData";
import Language from "../../hooks/Language";

import Navbar from "../../components/Navbar/Navbar";
import Wires from '../../components/Wires/Wires';
import Footer from "../../components/Footer/Footer";

import styles from './VenuePage.module.scss'



const VenuePage = () => {
  const language = Language();
  const params = useParams();
  const { t } = useTranslation();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const slug = params.venueTitle;
  const imageContainer = useRef(null);

  const data = useFetchData(`${API_URL}/venues`, language, slug, ["locations", "venueImages", "participants", "venue_locations", "venue_events"]);  


  const venue = data?.data[0]?.attributes;
  // venue && console.log(venue);
  const venueLocations = venue?.venue_locations.data.map(venueLocation => venueLocation.attributes);
  // venueLocations && console.log(venueLocations);

  const { startDate, finishDate } = venue || {};

  const startDateObj = startDate && new Date(venue.startDate);
  const finishDateObj = finishDate && new Date(venue.finishDate);

  const locations = venue?.locations.data.map((location) => location.attributes);

  const venueImages = venue?.venueImages.data;
  const program = venue?.program;
  const isGermanLanguage = venue?.isGermanLanguage;
  isGermanLanguage && console.log(isGermanLanguage);
  const participantsDatas = venue?.participants?.data?.map((participantData) => participantData.attributes);
  const participants = participantsDatas && participantsDatas.sort((paricipant1, participant2) => paricipant1.fullName.localeCompare(participant2.fullName));

  const venueEvents = venue?.venue_events.data.map((eventData) => {
    const smallEventData = eventData.attributes.smallEvent.data.attributes;
    smallEventData.alternativeLocation = eventData.attributes.alternativeLocation;
    smallEventData.alternativeDescription = eventData.attributes.alternativeDescription;
    return smallEventData;
  });

  // venue && console.log(venue);
  
  const [isMobile, setIsMobile] = useState(false);

  
  const sortedVenues = (venuesArray) => {
    const compareStartDate = (a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);

      return dateB - dateA;
    };
    return venuesArray.sort(compareStartDate);
  };

  useEffect(() => {
    // Reset scroll to the top when the component mounts
    window.scrollTo(0, 0);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [slug]);



  return (
    <>
      <Navbar isGermanLanguage={isGermanLanguage} />
      {venue && (
        <main className={styles.venuePage}>
          <header className={styles.headerInfo}>
            <div className={styles.headerSideInfo}>
              {locations.length === 1 ? (
                <>
                  <p className={styles.locationAddress}>
                    {locations[0].locationAddress.slice(
                      0,
                      locations[0].locationAddress.lastIndexOf(", ")
                    )}
                    <br></br>
                    {locations[0].locationAddress.slice(
                      locations[0].locationAddress.lastIndexOf(", ") + 2,
                      locations[0].locationAddress.length
                    )}
                  </p>
                  <p>
                    Opening Hours: <br></br>
                    {locations[0].openingHours}
                  </p>
                </>
              ) : null}
            </div>

            <div className={styles.headerMainInfo}>
              <p className={styles.location}>
                {locations
                  .map((location, i) => location.locationName)
                  .join(", ")}
              </p>
              <p className={styles.dates}>
                {`${t(
                  monthNames[startDateObj.getMonth()].toLowerCase()
                )} ${startDateObj.getDate()}`}
                {finishDateObj
                  ? "–" +
                    `${t(
                      monthNames[finishDateObj.getMonth()].toLowerCase()
                    )} ${finishDateObj?.getDate()}`
                  : " " +
                    venue.venueOpeningTime.slice(
                      0,
                      venue.venueOpeningTime.indexOf(":", 3)
                    )}
              </p>
              <h1 className={styles.venueTitle}>{venue.title}</h1>
              <p>{venue.curators}</p>
            </div>
          </header>

          {venueImages && (
            <section className={styles.images}>
              <Wires container={imageContainer.current} />
              <div className={styles.imageContainer} ref={imageContainer}>
                {venueImages.map((imageData, i) => {
                  const image = imageData.attributes;
                  return <img key={i} src={image.url} alt={image.name}></img>;
                })}
              </div>
              <p>{venue.imageSource}</p>
            </section>
          )}

          <section className={styles.venueDetails}>
            <div className={styles.sideDetails}>
              {venueLocations && venueLocations.length <= 1 ? (
                <>
                  {/* PROGRAM */}
                  {program && (
                    <div className={styles.program}>
                      <h2>{t("Program")}</h2>
                      <div className={styles.programList}>
                        {program &&
                          program.map((event, i) => (
                            <div className={styles.event} key={i}>
                              <h3 className={styles.eventTitle}>
                                {event.event}
                              </h3>
                              <p>
                                {event.date}
                                <br></br>
                                {event.time}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* PARTICIPANTS */}

                  {!!participants.length && (
                    <div className={styles.participants}>
                      <h2>{t("Participants")}</h2>
                      <ul className={styles.participantsList}>
                        {participants.map((participant, i) => (
                          <li key={i}>
                            <Link
                              to={`/${language}/participants/${participant.slug}`}
                            >
                              {participant.fullName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <ul className={styles.venueLocations}>
                  {venueLocations.map((venueLocation) => {
                    const location = venueLocation.location.data.attributes;
                    const participantsDatas =
                      venueLocation.participants.data.map(
                        (participant) => participant.attributes
                      );
                    const participants =
                      participantsDatas &&
                      participantsDatas.sort((paricipant1, participant2) =>
                        paricipant1.fullName.localeCompare(
                          participant2.fullName
                        )
                      );
                    return (
                      <li>
                        <h3 className={styles.venueLocationTitle}>
                          {location.locationName}
                        </h3>
                        <div className={styles.addressAndTime}>
                          <p className={styles.address}>
                            {location.locationAddress.slice(
                              0,
                              location.locationAddress.lastIndexOf(", ")
                            )}
                            <br></br>
                            {location.locationAddress.slice(
                              location.locationAddress.lastIndexOf(", ") + 2,
                              location.locationAddress.length
                            )}
                          </p>

                          <p className={styles.openingTimes}>
                            Opening Hours:<br></br>
                            {location.openingHours}
                          </p>
                        </div>
                        <p>
                          Participants:{" "}
                          {participants.map((participant, i) => (
                            <span>
                              <Link
                                to={`/${language}/participants/${participant.slug}`}
                              >
                                {participant.fullName}
                              </Link>
                              {i !== participants.length - 1 ? ", " : null}
                            </span>
                          ))}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className={styles.venueDescriptionAndProgramTitle}>
              <p className={styles.venueDescription}>
                {venue.venueDescription}
              </p>
              {!!venueEvents.length && venueEvents && !isMobile && (
                <h2 className={styles.programTitle}>{t("Program")}</h2>
              )}
            </div>
          </section>
          <>
            {isMobile && (<h2 className={styles.mobileProgramTitle}>{t("Program")}</h2>)}
            {!!venueEvents.length && venueEvents && (
              <ul className={styles.venueEvents}>
                {sortedVenues(venueEvents).map((venueEvent, i) => {
                  let address =
                    venueEvent.locations.data[0].attributes.locationAddress;
                  let eventStartDateObj = new Date(venueEvent.startDate);
                  let desciption =
                    venueEvent.venueDescription.length > 600
                      ? venueEvent.venueDescription.slice(0, 300) + " . . ."
                      : venueEvent.venueDescription;
                  return (
                    <li key={i}>
                      <div className={styles.venueEventTitle}>
                        <Link to={`/${language}/program/${venueEvent.slug}`}>
                          {venueEvent.title}
                        </Link>
                      </div>
                      <div className={styles.venueDateTimeAddress}>
                        {`${t(
                          monthNames[eventStartDateObj.getMonth()].toLowerCase()
                        )} ${eventStartDateObj.getDate()}` +
                          ", " +
                          venueEvent.venueOpeningTime.slice(0, 5)}
                        <br></br>
                        {(venueEvent.alternativeLocation) ? venueEvent.alternativeLocation : address}
                      </div>
                      <div className={styles.venueEventDescription}>
                        <Link to={`/${language}/program/${venueEvent.slug}`}>
                        {(venueEvent.alternativeDescription) ? venueEvent.alternativeDescription : desciption}
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
          <div className={styles.footer}>
            <Footer />
          </div>
        </main>
      )}
    </>
  );
}

export default VenuePage;