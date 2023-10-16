import React, { useEffect, useState } from 'react';

import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next';

import { API_URL } from "../../config";
import Language from "../../hooks/Language";
import useFetchData from "../../hooks/useFetchData";

import Navbar from "../../components/Navbar/Navbar";
import Footer from '../../components/Footer/Footer';

import styles from "./AboutPage.module.scss";

const AboutPage = () => {

  const { t } = useTranslation();
  const language = Language();

  const data = useFetchData(`${API_URL}/about-pages`, language, "", [
    "partnersLogos",
    "partnersLogosMobile",
  ]);
  data && console.log(data);
  const content = data && data.data[0].attributes;
  const pressSources = content && content.pressSources;
  const partnersLogos = content && content.partnersLogos.data.attributes;
  const partnersLogosMobile = content && content.partnersLogosMobile.data.attributes;
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return ( 
    <>
      <Navbar />
      {content ? (
        <main className={styles.aboutSection}>

          <section className={styles.descriptions}>
            <div className={styles.description}>
              <h2 className={styles.descriptionTitle}>2023</h2>
              <div className={styles.descriptionText}>{content.thisYearDescription}</div>
            </div>
            <div className={styles.description}>
              <h2 className={styles.descriptionTitle}>{t("kbTitle")}</h2>
              <p className={styles.descriptionText}>{content.kbDescription}</p>
            </div>
          </section>

          <section className={styles.pressSection}>
            <h3 className={styles.pressSectionTitle}>{t("pressTitle")}</h3>
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
            <h3 className={styles.partnersTitle}>{t("partnersTitle")}</h3>
            {(isMobile) ? 
            (<img className={styles.partnersLogos} src={partnersLogosMobile.url} alt={partnersLogosMobile.title}></img>) 
            : (<img className={styles.partnersLogos} src={partnersLogos.url} alt={partnersLogos.title}></img>)
            }
          </section>

          <section className={styles.contacts}>
            <div className={styles.contactsInfos}>
              <div className={styles.contactsText}>
                <h3 className={styles.contactsTitle}>{t("contactsTitle")}</h3>
                <ReactMarkdown children={content.contactsText} />
              </div>

              <div className={styles.organisersText}>
                <h3 className={styles.contactsTitle}>{t("team")}</h3>
                <ReactMarkdown  children={content.organisersText} />
              </div>
              
            </div>
          </section>
          <Footer />
        </main>
      ) : null}
    </>
  )
}

export default AboutPage;