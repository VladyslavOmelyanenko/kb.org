
import { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';

function useFetchData(url, language, filter="") {
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
      projects: {
        populate: '*',
      }
    },
    filters: {
      // slug: {
      //   $eq: filter,
      // },
    },
  };

  if (filter !== "") {
    queryObject.filters["slug"] = {
      $eq: filter,
    }
  };

  const query = qs.stringify(queryObject);

  


  useEffect(() => {

    console.log(`${url}?${query}`);

    axios.get(`${url}?${query}`)
    .then(response => setData(response.data))
    .catch(error => console.error(error));
  }, [url, query]);

  return data;
}

export default useFetchData;