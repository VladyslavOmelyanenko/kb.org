import React from 'react';
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

  
  const categorizedParticipants = participants && categorizeParticipants(participants);
  categorizedParticipants && console.log(categorizedParticipants)

  return (
    <>
      <Navbar />
      <section className={styles.participantsSection}>
        <div className={styles.participantsContent}>
          <h2 className={styles.participantsTitle}>{t("participants")}</h2>
          <div className={styles.participantsNames}>
            {categorizedParticipants && Object.entries(categorizedParticipants).sort((a, b) => a[0].localeCompare(b[0])).map(category => {
              console.log(category);
              const letter = category[0];
              const participants = category[1];
              return (
                <div key={letter} className={styles.namesCategory}>
                  <h3>{letter}</h3>
                  <div className={styles.namesInCategory}>{participants.map((participant, i) => (
                    <Link to={participant.slug} key={i}>{participant.name}</Link>
                  ))}</div>
                </div>
              )
            })}
          </div>
        </div> 
      <Footer />
      </section>
    </>
  );
}

export default ParticipantsPage;