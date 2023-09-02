import { Routes, Route} from 'react-router-dom';

   

import 'normalize.css';
import './App.css'


import AboutPage from "./pages/AboutPage"; 
import ParticipantsPage from "./pages/ParticipantsPage/ParticipantsPage"
import LocationsPage from "./pages/LocationsPage"
import ProgramPage from "./pages/ProgramPage"
import PersonalParticipantPage from './pages/PersonalParticipantPage/PersonalParticipantPage';

import Navbar from './components/Navbar/Navbar';

import RedirectToEn from './components/RedirectToEn';




const App = () => {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<RedirectToEn />} />
        <Route path="/:language" element={<AboutPage />} />
        <Route path="/:language/locations" element={<LocationsPage />} />
        <Route path="/:language/program" element={<ProgramPage />} />
        <Route path="/:language/participants" element={<ParticipantsPage />} />
        <Route path="/:language/participants/:name" element={<PersonalParticipantPage />} />
      </Routes>

    </>
  );
}


export default App;
