import {useContext, useEffect, useState} from 'react';
import Banner from '../components/Banner';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import { Link, useNavigate } from 'react-router-dom';
import GlobalContext from '../store/GlobalContext';
import { useAuthContext } from '../hooks/useAuthContext';

const AllPatientPage = () => {
    const { user } = useAuthContext();
    const { store } = useContext(GlobalContext);
    const [patients, setPatients] = useState({});

   
    useEffect(() => {
      store.getAllDepartments();
      store.getAllPatients();
    }, [user]);
    return (
        <>
          <Banner goBackPath="/resource-management" />
          <div className="flex justify-center my-4">
            <div className="text-blue-500 p-4 rounded-lg text-3xl">
              All Patients
            </div>
          </div>
          <div className="flex justify-between items-center mx-8 mb-4">
            <SearchBar />
            {user && user.isAdmin && (
              // Adjusted button size to be smaller
              <Link  to={"/new-patient"}className="bg-[#2260FF] text-white px-2 py-1 rounded-md font-medium text-xl">
                New Patient
              </Link>
            )}
          </div>
          <div className="p-8">
            {user && store && <Table cards={store.patients} isAdmin={user.isAdmin} context={"patient"} />}
          </div>
        </>
      );
};

export default AllPatientPage;
