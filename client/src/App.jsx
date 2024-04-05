import RegistrationForm from "./screenpages/RegistrationForm";
import LoginForm from "./screenpages/LoginForm";
import AppPage from "./screenpages/AppPage";
import DoctorCard from "./screenpages/DoctorCard";
import PatientCard from "./screenpages/PatientCard";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Banner from "./components/Banner"
import FormField from "./components/FormField"
import Table from "./components/Table"
import { AuthContextProvider } from "./auth/AuthContext";
import NewUserForm from "./screenpages/NewUserForm";
import AllRoomsPage from "./components/AllRoomsPage";
import AllEquipmentPage from "./components/AllEquipmentPage";
import EquipmentCard from "./components/EquipmentCard";
import RoomCard from './components/RoomCard';
import ProfileCard from "./components/ProfileCard";

import HomePage from "./screenpages/HomePage";
import HubPage from "./components/HubPage";
function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HubPage />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm/>} />
            <Route path="/create-new-user" element={<NewUserForm/>} />
            <Route path="/doctorcard" element={<DoctorCard/>} />
            <Route path="/equipmentcard" element={<EquipmentCard/>} />
            <Route path="/roomcard" element={<RoomCard/>} />
            <Route path="/profilecard" element={<ProfileCard/>} />
          <Route path="/apppage" element={<AppPage/>} />
          
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
