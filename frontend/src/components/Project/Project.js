import React, { useState, useEffect, useRef } from 'react';

import VenueTag from '../VenueTag/VenueTag';
import Wires from '../Wires/Wires';

import styles from './Project.module.scss'


const Project = (props) => {

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const project = props.projectObject;
  const projectMedia = project.projectMedia.data && project.projectMedia.data.map((projectMedia) => projectMedia.attributes);
  const projectVenue = project.venue.data && project.venue.data.attributes;
  const imageContainer = useRef(null);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {project && (
        <div className={styles.project}>
          <div className={styles.descriptionAndVenue}>
            <div className={styles.projectDetails}>
              <hr></hr>
              <h2 className={styles.projectTitle}>{project.title}</h2>
              <p className={styles.projectParameters}>
                {project.year}, {project.dimension} 
                <br></br>
                {project.materials}
              </p>
              <p className={styles.projectDescription}>
                {project.description}
              </p>
            </div>
            {(!isMobile) && (
              <div className={styles.venueTag} >
               {projectVenue && <VenueTag venue={project.venue.data.attributes}/>}
              </div>
            )}
          </div>
          <div className={styles.imageContainer}>
            <div className={styles.projectImages} ref={imageContainer}>
              {projectMedia && projectMedia.map((media, i) => (
                <img key={i} src={media.url} alt={media.alternativeText}></img>
              ))}
            </div>
            <Wires container={imageContainer.current}/>
          </div>
          {project.imageSource && !!project.imageSource.length && <p className={styles.imageSource}>{project.imageSource}</p>}
          {(isMobile) && (
            <div className={styles.venueTag} >
              {projectVenue && <VenueTag enabled={false} venue={projectVenue}/>}
            </div>
          )}
        </div>
      )}
    </>
  )
};

export default Project;