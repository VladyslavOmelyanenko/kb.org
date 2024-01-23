import { Link } from "react-router-dom";
import { useEffect } from "react";
 
import { useTranslation } from "react-i18next";

import landingVideo from "./landing.mp4";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";


import styles from "./LandingPageNew.module.scss";
const LandingPageNew = () => {

  const { t } = useTranslation();

    const triggerOpacity = (element) => {
      const appear = () => {
        let opacity = 0;
        let appearing = true;
        const interval = setInterval(() => {
          if (appearing) {
            opacity += 0.01;
          } else {
            opacity -= 0.01;
            if (opacity <= 0) clearInterval(interval);
          }
          element.style.opacity = opacity;
          if (opacity >= 1) appearing = false;
        }, 14);
      };

      appear();
    };

    useEffect(() => {
      const animate = () => {
        const titles = document.getElementsByClassName("locationText");
        Array.from(titles).forEach((ele, index) => {
          ele.style.opacity = "0";
          setTimeout(() => triggerOpacity(ele), index * 1000);
          setInterval(() => {
            ele.style.opacity = "0";
            setTimeout(() => triggerOpacity(ele), index * 1000);
          }, 10000);
        });
      };

      animate();
    }, []); 

  return (
    <>
      <div className={styles.desktop}>
        <div className={styles.nav}>
          <Navbar isTransparent={true} />
        </div>
        <main>
          <div className={styles.videoBlock}>
            <video
              className={styles.landingVideo}
              autoPlay
              muted
              loop
              src={landingVideo}
            ></video>
          </div>
          <div className={styles.links}>
            <Link to="about" className={styles.aboutText}>
              {t("about")}
            </Link>

            <Link to="participants" className={styles.participantsText}>
              {t("participants")}
            </Link>

            <Link to="locations" className={styles.locationsText}>
              {t("locations")}
            </Link>

            <Link to="program" className={styles.programText}>
              {t("program")}
            </Link>

            <Link
              to="locations/kyiv"
              className={`${styles.kyivText} locationText`}
            >
              {t("kyiv")}
            </Link>

            <Link
              to="locations/ivano-frankivsk"
              className={`${styles.ivanoFrankivskText} locationText`}
            >
              {t("ivanoFrankivsk")}
            </Link>

            <Link
              to="locations/uzhhorod"
              className={`${styles.uzhhorodText} locationText`}
            >
              {t("uzhhorod")}
            </Link>

            <Link
              to="locations/vienna"
              className={`${styles.viennaText} locationText`}
            >
              {t("vienna")}
            </Link>

            <Link
              to="locations/lublin"
              className={`${styles.lublinText} locationText`}
            >
              {t("lublin")}
            </Link>

            <Link
              to="locations/warsaw"
              className={`${styles.warsawText} locationText`}
            >
              {t("warsaw")}
            </Link>

            <Link
              to="locations/antwerp"
              className={`${styles.antwerpText} locationText`}
            >
              {t("antwerp")}
            </Link>

            <Link
              to="locations/berlin"
              className={`${styles.berlinText} locationText`}
            >
              {t("berlin")}
            </Link>
          </div>
          <Footer />
        </main>
      </div>

      <div className={styles.container}>
        <Navbar />
        <div className={styles.mobile}>
          <video className={styles.video} autoPlay muted playsInline loop>
            <source src="/mobileGif.mp4"></source>
          </video>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LandingPageNew;
