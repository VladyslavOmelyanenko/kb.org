import React from 'react';

import VenueTag from '../VenueTag/VenueTag';

import styles from './Project.module.scss'





const Project = (props) => {

  const project = props.projectObject;
  const projectMedia = project.projectMedia.data.map((projectMedia) => projectMedia.attributes);
  
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
            <div className={styles.VenueTag} >
              <VenueTag venue={project.venue.data.attributes}/>
            </div>
          </div>
          <div className={styles.projectImages}>
            {projectMedia.map((media, i) => (
              <img key={i} src={media.url} alt={media.alternativeText}></img>
            ))}
          </div>
          <p className={styles.imageSource}>{project.imageSource}</p>
        </div>
      )}
    </>
  )
};

export default Project;