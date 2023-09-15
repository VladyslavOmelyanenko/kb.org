import { Link } from 'react-router-dom';

import {API_URL} from "../../config";
import useFetchData from "../../hooks/useFetchData";
import Language from "../../hooks/Language";
import { useParams } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import styles from './VenuePage.module.scss'



const VenuePage = () => {
  const language = Language();
  const params = useParams();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const slug = params.venueTitle;

  const data = useFetchData(`${API_URL}/venues`, language, slug);

  const venue = data?.data[0]?.attributes;
  venue && console.log(venue);

  const { startDate, finishDate } = venue || {};

  const startDateObj = startDate && new Date(venue.startDate);
  const finishDateObj = finishDate && new Date(venue.finishDate);

  const location = venue?.location.data?.attributes;
  location && console.log(location);

  const venueImages = venue?.venueImages.data;
  const program = venue?.program;
  const participants = venue?.projects.data.map((project) => project.attributes.participant.data.attributes).filter((value, index, self) => self.findIndex((t) => (t.fullName === value.fullName)) === index);
;
  participants && console.log(participants);
  console.log(language);


  return (
    <>
      <Navbar />
      {(venue) && (
        <main className={styles.venuePage}>
          <header className={styles.headerInfo}>

            <div className={styles.headerSideInfo}>
              <p className={styles.locationAddress}>{location.locationAddress}</p>
              <h3>Opening hours</h3>
              <p>{location.openingHours}</p>
            </div>

            <div className={styles.headerMainInfo}>
              <p className={styles.location}>{location.locationName + ', ' + location.city}</p>
              <p>{`${monthNames[startDateObj.getMonth()]} ${startDateObj.getDate()}–${monthNames[finishDateObj.getMonth()]} ${finishDateObj.getDate()}`}</p>
              <h1 className={styles.venueTitle}>{venue.title}</h1>
              <p>{venue.curators}</p>
            </div>

          </header>

          {venueImages && (
            <section className={styles.images}>
              <div className={styles.imageContainer}>
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
                <h2>Program</h2>
                <div className={styles.programList}>
                  {program.map((event, i) => (
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
                <h2>Participants</h2>
                <ul className={styles.participantsList}>
                  {participants.map((participant, i) => <li><Link to={`/${language}/participants/${participant.slug}`} key={i}>{participant.fullName}</Link></li>)}
                </ul>
              </div>

            </div>

            <p className={styles.venueDescription}>
                {venue.venueDescription}
            </p>
          </section>
          <Footer />
        </main>
      )}
    </>
  );
}

export default VenuePage;