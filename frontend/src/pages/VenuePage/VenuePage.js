import { useRef } from "react";
import { Link, useParams } from "react-router-dom";

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

  const data = useFetchData(`${API_URL}/venues`, language, slug);

  const venue = data?.data[0]?.attributes;

  const { startDate, finishDate } = venue || {};

  const startDateObj = startDate && new Date(venue.startDate);
  const finishDateObj = finishDate && new Date(venue.finishDate);

  const location = venue?.location.data?.attributes;

  const venueImages = venue?.venueImages.data;
  const program = venue?.program;
  const participants = venue?.projects.data.map((project) => project.attributes.participant.data.attributes).filter((value, index, self) => self.findIndex((t) => (t.fullName === value.fullName)) === index);



  return (
    <>
      <Navbar />
      {(venue) && (
        <main className={styles.venuePage}>
          <header className={styles.headerInfo}>

            <div className={styles.headerSideInfo}>
              <p className={styles.locationAddress}>{location.locationAddress}</p>
              <p>{location.openingHours}</p>
            </div>

            <div className={styles.headerMainInfo}>
              <p className={styles.location}>{location.locationName + ', ' + location.city}</p>
              <p className={styles.dates}>{`${t(monthNames[startDateObj.getMonth()].toLowerCase())} ${startDateObj.getDate()}–${t(monthNames[finishDateObj.getMonth()].toLowerCase())} ${finishDateObj.getDate()}`}</p>
              <h1 className={styles.venueTitle}>{venue.title}</h1>
              <p>{venue.curators}</p>
            </div>

          </header>

          {venueImages && (
            <section className={styles.images}>
              <Wires container={imageContainer.current}/>
              <div className={styles.imageContainer} ref={imageContainer}>
                {venueImages.map((imageData, i) => {
                  const image = imageData.attributes;
                  return <img key={i} src={image.url} alt={image.name}></img>
                })}
              </div>
              <p>{venue.imageSource}</p>
            </section>
          )}

          <section className={styles.venueDetails}>
            <div className={styles.sideDetails}>

              <div className={styles.program}>
                <h2>{t("Program")}</h2>
                <div className={styles.programList}>
                  {program && program.map((event, i) => (
                    <div className={styles.event} key={i}>
                      <p>
                        {event.date}<br></br>
                        {event.time}
                      </p>
                      <h3 className={styles.eventTitle}>{event.event}</h3>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.participants}>
                <h2>{t("Participants")}</h2>
                <ul className={styles.participantsList}>
                  {participants.map((participant, i) => <li><Link to={`/${language}/participants/${participant.slug}`} key={i}>{participant.fullName}</Link></li>)}
                </ul>
              </div>

            </div>

            <p className={styles.venueDescription}>
                {venue.venueDescription}
            </p>
          <Footer />
          </section>
        </main>
      )}
    </>
  );
}

export default VenuePage;