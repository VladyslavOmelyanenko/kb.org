
import { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';

function useFetchData(url, language, filter="", populations) {
  const [data, setData] = useState(null);
  if (language === 'ukr') {
    language = 'uk'
  } else if (language === 'eng') {
    language = 'en';
  }

  const queryObject = {
    locale: language,
    populate: {
      participantImage: true,
      partnersLogos: true,
      partnersLogosMobile: true,
      locationImage: true,
      cityLogo: true,
      venues: true,
      projects: {
        populate: {
          projectMedia: true,
          venue: {
            populate: '*'
          }
        }
      },
      
    },
    filters: {
      // slug: {
      //   $eq: filter,
      // },
    },
  };

// populations.forEach(population => {
//     queryObject.populate[population] = true;
// });

  if (filter !== "") {
    queryObject.filters["slug"] = {
      $eq: filter,
    }
  };

  const query = qs.stringify(queryObject);

  


  useEffect(() => {

    axios.get(`${url}?${query}`)
    .then(response => setData(response.data))
    .catch(error => console.error(error));
  }, [url, query]);

  return data;
}

export default useFetchData;