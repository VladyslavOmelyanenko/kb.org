import React, { useState, useEffect } from 'react';

import VenueTag from '../VenueTag/VenueTag';
import Wires from '../Wires/Wires';

import styles from './Project.module.scss'


const Project = (props) => {

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const project = props.projectObject;
  const projectMedia = project.projectMedia.data && project.projectMedia.data.map((projectMedia) => projectMedia.attributes);
  const projectVenue = project.venue.data && project.venue.data.attributes;
  
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
        <div>
          <div className={styles.descriptionAndVenue}>
            <div className={styles.projectDetails}>
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
            <Wires />
            <div className={styles.projectImages}>
              {projectMedia && projectMedia.map((media, i) => (
                <img key={i} src={media.url} alt={media.alternativeText}></img>
              ))}
            </div>
          </div>
          {project.imageSource && !!project.imageSource.length && <p className={styles.imageSource}>{project.imageSource}</p>}
          {(isMobile) && (
            <div className={styles.venueTag} >
              {projectVenue && <VenueTag venue={projectVenue}/>}
            </div>
          )}
        </div>
      )}
    </>
  )
};

export default Project;