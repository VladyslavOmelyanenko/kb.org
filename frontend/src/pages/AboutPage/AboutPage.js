import React from 'react';
import ReactMarkdown from 'react-markdown'

// import { useTranslation } from 'react-i18next';

import { API_URL } from "../../config";
import Language from "../../hooks/Language";
import useFetchData from "../../hooks/useFetchData";

import Navbar from "../../components/Navbar/Navbar";
import Footer from '../../components/Footer/Footer';

import styles from "./AboutPage.module.scss";

const AboutPage = () => {

  // const { t } = useTranslation();
  const language = Language();

  const data = useFetchData(`${API_URL}/about-pages`, language);
  const content = data && data.data[0].attributes;
  const pressSources = content && content.pressSources;
  const partnersLogos = content && content.partnersLogos.data.attributes;



  return ( 
    <>
      <Navbar />
      {content ? (
        <main className={styles.aboutSection}>

          <section className={styles.descriptions}>
            <div className={styles.description}>
              <h2 className={styles.descriptionTitle}>{content.thisYearTitle}</h2>
              <div className={styles.descriptionText}>{content.thisYearDescription}</div>
            </div>
            <div className={styles.description}>
              <h2 className={styles.descriptionTitle}>{content.kbTitle}</h2>
              <p className={styles.descriptionText}>{content.kbDescription}</p>
            </div>
          </section>

          <section className={styles.pressSection}>
            <h3 className={styles.pressSectionTitle}>{content.pressTitle}</h3>
            <ul className={styles.pressList}>
              {pressSources.map((pressSource, i) => (
                <li className={styles.pressSource} key={i}>
                  <h4>{pressSource.pressTitle}</h4>
                  <a href={pressSource.articleLink}>{pressSource.articleTitle}</a>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.partners}>
            <h3 className={styles.partnersTitle}>{content.partnersTitle}</h3>
            <img className={styles.partnersLogos} src={partnersLogos.url} alt={partnersLogos.title}></img>
          </section>

          <section className={styles.contacts}>
            <h3 className={styles.contactsTitle}>{content.contactsTitle}</h3>
            <div className={styles.contactsInfos}>
            
              <ReactMarkdown className={styles.contactsText} children={content.contactsText} />
              <ReactMarkdown className={styles.organisersText} children={content.organisersText} />
            </div>
          </section>
          <Footer />
        </main>
      ) : null}
    </>
  )
}

export default AboutPage;