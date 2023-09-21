import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {API_URL} from "../../config";
import Language from "../../hooks/Language";
import useFetchData from "../../hooks/useFetchData";

import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

import styles from './ParticipantsPage.module.scss'


const ParticipantsPage = () => {
  
  const { t } = useTranslation();
  const language = Language();
  const containerToScroll = useRef(null);

  const data = useFetchData(`${API_URL}/participants`, language);

  const participants = data && data.data.map((participantData) => ({
    name: participantData.attributes.fullName,
    slug: participantData.attributes.slug
  }));
  
  const categorizeParticipants = (participants) => {
    const categorizedNames = {};

    participants.forEach((participant) => {
      const firstLetter = participant.name.charAt(0).toUpperCase();
      
      if (categorizedNames.hasOwnProperty(firstLetter)) {
        categorizedNames[firstLetter].push(participant);
      } else {
        categorizedNames[firstLetter] = [participant];
      }
    });

    return categorizedNames;
  }


  useEffect(() => {

      if (window.innerWidth > 768) {
        document.body.style.overscrollBehavior = "none";

      }

    return () => {
        document.body.style.overscrollBehavior = "auto";

    };
  }, );
  
  const categorizedParticipants = participants && categorizeParticipants(participants);

  return (
    <>
      <Navbar />
      <section
        className={styles.participantsSection}
        onWheel={(event) => {
          if (!event.deltaY) {
            return;
          }
          containerToScroll.current.scrollLeft += event.deltaY + event.deltaX;
        }}
      >
        <div className={styles.participantsContent}>
          <h2 className={styles.participantsTitle}>{t("participants")}</h2>
          <div className={styles.participantsNames} ref={containerToScroll}>
            {categorizedParticipants &&
              Object.entries(categorizedParticipants)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map((category) => {
                  const letter = category[0];
                  const participants = category[1];
                  return (
                    <div key={letter} className={styles.namesCategory}>
                      <h3>{letter}</h3>
                      <div className={styles.namesInCategory}>
                        {participants.map((participant, i) => (
                          <Link to={participant.slug} key={i}>
                            {participant.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
}

export default ParticipantsPage;