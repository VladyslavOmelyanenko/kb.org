import Language from "../hooks/Language";
import useFetchData from "../hooks/useFetchData";


const AboutPage = () => {
  const language = Language();

  const data = useFetchData('http://localhost:1337/api/locations', language)
  data && console.log(data.data[0].attributes);

  return ( 
    <>
      <h1>About {language}</h1>
    </>
  )
}

export default AboutPage;