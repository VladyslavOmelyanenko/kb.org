
import {API_URL} from "../../config";
import useFetchData from "../../hooks/useFetchData";
import Language from "../../hooks/Language";
import { useParams } from "react-router-dom";


import Navbar from "../../components/Navbar/Navbar";
import Project from "../../components/Project/Project";

import styles from './PersonalParticipantPage.module.scss'


const PersonalParticipantPage = () => {

  const language = Language();
  const params = useParams();
  const slug = params.name;

  const data = useFetchData(`${API_URL}/participants`, language, slug);

  const currentParticipant = data && data.data[0].attributes;
  const currentParticipantProjects = currentParticipant && currentParticipant.projects.data;
  currentParticipant && console.log(currentParticipant);


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
            <a href={currentParticipant.participantLink}>{currentParticipant.participantLink}</a>
            <a href={currentParticipant.instagramLink}>Instagram</a>
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