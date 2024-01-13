
import { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';

function useFetchData(url, language, filter="", fieldsToPopulate) {
  const [data, setData] = useState(null);
  if (language === 'ukr') {
    language = 'uk'
  } else if (language === 'eng') {
    language = 'en';
  }
  
  const queryObject = {
    locale: language,
    // populate: {
    //   participantImage: true,
    //   partnersLogos: true,
    //   partnersLogosMobile: true,
    //   locationImage: true,
    //   cityLogo: true,
    //   participants: true,
    //   venues: {
    //     populate: {
    //       location: {
    //         populate: '*',
    //       }
    //     }
    //   },
    //   venueImages: true,
    //   location: {
    //     populate: '*',
    //   },
    //   projects: {
    //     populate: {
    //       projectMedia: true,
    //       participant: true,
    //       venue: {
    //         populate: {
    //           location: {
    //             populate: '*'
    //           }
    //         }
    //       }
    //     }
    //   },
      
    // },
    populate: {},
    filters: {
      // slug: {
      //   $eq: filter,
      // },
    },
  };

  fieldsToPopulate.forEach(population => {
      if (population === "projects") {
        queryObject.populate[population] = { populate: {
          projectMedia: true,
          participant: true,
          venue: {
            populate: {
              locations: {
                populate: '*'
              }
            }
          }
        }}
      } else if (population === "venues") {
        queryObject.populate[population] = {
          populate: {
            locations: {
              populate: '*',
            }
          }
        }
      } else if (population === "venue_locations") {
        queryObject.populate[population] = {
          populate: {
            Name: true,
            location: {
              populate: "*",
            },
            participants: {
              populate: "*",
            },
          },
        };
      } else if (population === "venue_events") {
        queryObject.populate[population] = {
          populate: {
            Name: true,
            smallEvent: {
              populate: "*",
            }
          },
        };
      } else {
        queryObject.populate[population] = true;
      }
  });

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