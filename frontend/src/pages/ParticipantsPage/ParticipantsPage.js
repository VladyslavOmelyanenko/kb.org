// import React, { useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {API_URL} from "../../config";
import Language from "../../hooks/Language";
import useFetchData from "../../hooks/useFetchData";

import styles from './ParticipantsPage.module.scss'

import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';


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
  // categorizedParticipants && console.log(Object.entries(categorizedParticipants));

  // test data


  // const categorizeParticipants = (participants) => {
  //   const categorizedNames = {};

  //   participants.forEach((participant) => {
  //     const firstLetter = participant.charAt(0).toUpperCase();
      
  //     if (categorizedNames.hasOwnProperty(firstLetter)) {
  //       categorizedNames[firstLetter].push(participant);
  //     } else {
  //       categorizedNames[firstLetter] = [participant];
  //     }
  //   });

  //   return categorizedNames;
  // }

  // let participantsTestData = "Alina Kleytman ,Aliona Tokovenko ,Alisa Sizykh ,Anna Zilahy,Anton Shebetko ,Ashley Hans Scheirl ,Bohdan Bunchak,Bohdan Moroz ,Clemens Wedemeyer / eeefffff ,Dan Perjovschi ,Dana Kavelina ,Daniel Otero Torres ,Daria Chernyshova ,Daryia Tsymbalyuk ,DeNeDe Collective ,Franz Kapfer ,Georgia Sagri,Hamlet Lavastida ,Hans Ostapenko ,Hito Steyerl ,Ivan Melnychuk ,Július Koller,Kateryna Aliynyk ,Ksenia Hnylytska ,Lisovenko Kateryna ,Livyj Bereh and Roman Himey,Lisovenko Kateryna ,Livyj Bereh and Roman Himey ,Livyj Bereh and Roman Himey ,Lisovenko Kateryna,Majd Abdul Hamid ,Mangelos ,Mark Verlan ,Mary Lydon ,Miriam Stoney ,Mona Vatamanu & Florin Tudor,Mountaincutters artist,Nikita Kadan ,Nikolai Karabinovich ,Peace Delegation ,Selma Doborac ,Superflex,The Laundry Collective ,Tomas Kajanek ,Toni Schmale ,Toni Schmale,Vladislav Plisetsky ,Wolfgang Tillmans ,Yarema Himey ,Yves Netzhammer ,Zofia Kulik";
  // participantsTestData = participantsTestData.split(',');

  // const categorizedParticipants = participantsTestData && categorizeParticipants(participantsTestData);
  // categorizedParticipants && console.log(Object.entries(categorizedParticipants));


  
    

  // REPLACE PARTICIPANTSTESTDATA WITH PARITICPANTSNAMES

  return (
    <>
      <Navbar />
      <section className={styles.participantsSection}>
        <div className={styles.participantsContent}>
          <h2 className={styles.participantsTitle}>{t("participants")}</h2>
          <div className={styles.participantsNames}>
            {categorizedParticipants && Object.entries(categorizedParticipants).map(category => {
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