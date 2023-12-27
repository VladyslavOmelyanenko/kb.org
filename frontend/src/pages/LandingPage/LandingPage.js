import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";



import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer"

import AboutWire from "../../components/LandingWires/AboutWire";
import ParticipantsWire from "../../components/LandingWires/ParticipantsWire";
import LocationsWire from "../../components/LandingWires/LocationsWire";
import ProgramWire from "../../components/LandingWires/ProgramWire";

import LublinWire from "../../components/LandingWires/LublinWire";
import ViennaWire from "../../components/LandingWires/ViennaWire";
import AntwerpWire from "../../components/LandingWires/AntwerpWire";
import IvanoFrankivskWire from "../../components/LandingWires/IvanoFrankivskWire";
import KyivWire from "../../components/LandingWires/KyivWire";
import WarsawWire from "../../components/LandingWires/WarsawWire";
import UzhhorodWire from "../../components/LandingWires/UzhhorodWire";


import BerlinWire from "../../components/LandingWires/BerlinWire";
import FarRightWire from "../../components/LandingWires/FarRightWire";

import styles from "./LandingPage.module.scss";



const LandingPage = () => {

  const [containerWidth, setContainerWidth] = useState(
    window.innerHeight < window.innerWidth * 0.56
      ? window.innerHeight / 0.56
      : window.innerWidth
  );
  const [containerHeight, setContainerHeight] = useState(
    window.innerHeight < window.innerWidth * 0.56
      ? window.innerHeight
      : window.innerWidth * 0.56
  );
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hoveredWire, setHoveredWire] = useState("");

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
    }

    appear()
  }

  
  
  
  
  useEffect(() => {

    const animate = () => {
      const titles = document.getElementsByClassName('locationText');
      Array.from(titles).forEach((ele, index) => {
        ele.style.opacity = "0";
        setTimeout(() => triggerOpacity(ele), index * 1000);
        setInterval(() => {
          ele.style.opacity = "0";
          setTimeout(() => triggerOpacity(ele), index * 1000);
        }, 10000)
      })
    }
    
    animate();

     const handleResize = () => {
      if (window.innerHeight < window.innerWidth * 0.56) {
        setContainerHeight(window.innerHeight);
        setContainerWidth(window.innerHeight / 0.56)
      } else {
        setContainerWidth(window.innerWidth);
        setContainerHeight(window.innerWidth * 0.56);
      }
     };
     handleResize();
     
     const documentHeight = () => {
       const doc = document.documentElement;
       doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
     };

     documentHeight();

     window.addEventListener("resize", handleResize);
     window.addEventListener("resize", documentHeight);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", documentHeight);
     };
   }, []); 


  return (
    <>
      <div className={styles.desktop}>
        <div className={styles.nav}>
          <Navbar isTransparent={true} />
        </div>
        <div className={styles.wireAddress}>{t(hoveredWire)}</div>
        <main className={styles.landing}>
          <div
            className={styles.wires}
            style={{
              width: `${containerWidth}px`,
              height: `${containerHeight}px`,
            }}
          >
            <svg
              className={styles.aboutWire}
              viewBox="0 0 675.89 334"
              onClick={() => navigate("about")}
              onMouseEnter={() => setHoveredWire(t("about"))}
              onMouseLeave={() => setHoveredWire("")}
            >
              <AboutWire />
            </svg>
            <Link to="about" className={styles.aboutText}>
              {t("about")}
            </Link>

            <svg
              onClick={() => navigate("participants")}
              onMouseEnter={() => setHoveredWire(t("participants"))}
              onMouseLeave={() => setHoveredWire("")}
              className={styles.participantsWire}
              version="1.1"
              id="Layer_2_00000000205732888792889190000005512364893094653837_"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 374.3 332.2"
              enable-background="new 0 0 374.3 332.2"
              xmlSpace="preserve"
            >
              <ParticipantsWire />
            </svg>
            <Link to="participants" className={styles.participantsText}>
              {t("participants")}
            </Link>

            <svg
              onClick={() => navigate("locations")}
              onMouseEnter={() => setHoveredWire(t("locations"))}
              onMouseLeave={() => setHoveredWire("")}
              className={styles.locationsWire}
              version="1.1"
              id="Layer_2_00000059304645361358911120000009970337663788556219_"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 622.8 465.8"
              enable-background="new 0 0 622.8 465.8"
              xmlSpace="preserve"
            >
              <LocationsWire />
            </svg>
            <Link to="locations" className={styles.locationsText}>
              {t("locations")}
            </Link>

            <svg
              onClick={() => navigate("program")}
              onMouseEnter={() => setHoveredWire(t("program"))}
              onMouseLeave={() => setHoveredWire("")}
              className={styles.programWire}
              viewBox="0 0 90.16 144.24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ProgramWire />
            </svg>
            <Link to="program" className={styles.programText}>
              {t("program")}
            </Link>

            <svg
              onClick={() => navigate("locations/lublin")}
              onMouseEnter={() => setHoveredWire(t("lublin"))}
              onMouseLeave={() => setHoveredWire("")}
              className={styles.lublinWire}
              viewBox="0 0 336.11 428.65"
              xmlns="http://www.w3.org/2000/svg"
            >
              <LublinWire />
            </svg>

            <svg
              onClick={() => navigate("locations/vienna")}
              onMouseEnter={() => setHoveredWire(t("vienna"))}
              onMouseLeave={() => setHoveredWire("")}
              className={styles.viennaWire}
              enableBackground="new 0 0 292.9 335.8"
              viewBox="0 0 292.9 335.8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ViennaWire />
            </svg>

            <svg
              onClick={() => navigate("locations/antwerp")}
              onMouseEnter={() => setHoveredWire(t("antwerp"))}
              onMouseLeave={() => setHoveredWire("")}
              className={styles.antwerpWire}
              viewBox="0 0 349 245"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <AntwerpWire />
            </svg>

            <svg
              onClick={() => navigate("locations/ivano-frankivsk")}
              onMouseEnter={() => setHoveredWire(t("ivanoFrankivsk"))}
              onMouseLeave={() => setHoveredWire("")}
              className={styles.ivanoFrankivskWire}
              viewBox="0 0 651.2 613.44"
              xmlns="http://www.w3.org/2000/svg"
            >
              <IvanoFrankivskWire />
            </svg>

            <svg
              onClick={() => navigate("locations/kyiv")}
              onMouseEnter={() => setHoveredWire(t("kyiv"))}
              onMouseLeave={() => setHoveredWire("")}
              className={styles.kyivWire}
              viewBox="0 0 425.81 379.79"
              xmlns="http://www.w3.org/2000/svg"
            >
              <KyivWire />
            </svg>

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

            <svg
              onClick={() => navigate("locations/warsaw")}
              onMouseEnter={() => setHoveredWire(t("warsaw"))}
              onMouseLeave={() => setHoveredWire("")}
              className={styles.warsawWire}
              viewBox="0 0 144.21 227.77"
              xmlns="http://www.w3.org/2000/svg"
            >
              <WarsawWire />
            </svg>

            <svg
              onClick={() => navigate("locations/berlin")}
              onMouseEnter={() => setHoveredWire(t("berlin"))}
              onMouseLeave={() => setHoveredWire("")}
              className={styles.uzhhorodWire}
              id="Layer_2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 569.29 204.16"
            >
              <UzhhorodWire />
            </svg>

            <svg
              onClick={() => navigate("locations/uzhhorod")}
              onMouseEnter={() => setHoveredWire(t("uzhhorod"))}
              onMouseLeave={() => setHoveredWire("")}
              className={styles.beforeRightWire}
              version="1.1"
              baseProfile="tiny"
              id="Layer_2_00000161618956946631819560000003508565006015759746_"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 469.8 468.7"
              overflow="visible"
              xmlSpace="preserve"
            >
              <BerlinWire />
            </svg>

            <svg
              className={styles.farRightWire}
              viewBox="0 0 323 411"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <FarRightWire />
            </svg>
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
}


export default LandingPage;