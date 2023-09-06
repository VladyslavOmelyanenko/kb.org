import { Routes, Route} from 'react-router-dom';

   

import 'normalize.css';
import './App.css'


import LandingPage from './pages/LandingPage/LandingPage';
import AboutPage from "./pages/AboutPage/AboutPage"; 
import ParticipantsPage from "./pages/ParticipantsPage/ParticipantsPage"
import LocationsPage from "./pages/LocationsPage/LocationsPage"
import ProgramPage from "./pages/ProgramPage/ProgramPage"
import PersonalParticipantPage from './pages/PersonalParticipantPage/PersonalParticipantPage';


import RedirectToEn from './components/RedirectToEn';




const App = () => {

  return (
    <>

      <Routes>
        <Route path="/" element={<RedirectToEn />} />
        <Route path="/:language" element={<LandingPage />} />
        <Route path="/:language/about" element={<AboutPage />} />
        <Route path="/:language/locations" element={<LocationsPage />} />
        <Route path="/:language/program" element={<ProgramPage />} />
        <Route path="/:language/participants" element={<ParticipantsPage />} />
        <Route path="/:language/participants/:name" element={<PersonalParticipantPage />} />
      </Routes>

    </>
  );
}


export default App;
