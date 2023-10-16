
import {API_URL} from "../../config";
import useFetchData from "../../hooks/useFetchData";
import { useTranslation } from "react-i18next";
import Language from "../../hooks/Language";
import { useParams } from "react-router-dom";


import Navbar from "../../components/Navbar/Navbar";
import Project from "../../components/Project/Project";

import styles from './PersonalParticipantPage.module.scss'


const PersonalParticipantPage = () => {

  const language = Language();
  const { t } = useTranslation();
  const params = useParams();
  const slug = params.name;

  const data = useFetchData(`${API_URL}/participants`, language, slug, ["participantImage", "projects", "venues"]);
  data && console.log(data);

  const currentParticipant = data && data.data[0].attributes;
  const currentParticipantProjects = currentParticipant && currentParticipant.projects.data;

  const participantImage = currentParticipant && currentParticipant.participantImage.data && currentParticipant.participantImage.data.attributes;
  

  return (
    <>
    <Navbar />
    {currentParticipant && (
      <section className={styles.participantPage}>
        <div className={styles.participantInfo}>
          <h1 className={styles.participantName}>{currentParticipant.fullName}</h1>
          <p className={styles.participantBio}>
            {currentParticipant.bio}
          </p>
          { participantImage && <img className={styles.participantImage} src={participantImage.url} alt={participantImage.alternativeText}></img> }
          <div className={styles.participantLinks}>
            {currentParticipant.participantLink && <a href={currentParticipant.participantLink}>{t("Website")}</a>}
            {currentParticipant.instagramLink && <a href={currentParticipant.instagramLink}>Instagram</a>}
          </div>
        </div>
        <div className={styles.participantProjects}>
          {currentParticipantProjects && currentParticipantProjects.map((project, i) => (
              <Project projectObject={project.attributes} key={i}/>
          ))}
        </div>

      </section>
    )}

   </>
  )
}

export default PersonalParticipantPage;