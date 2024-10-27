import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link} from 'react-router-dom'; // Corrected import
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
  const navigate = useNavigate(); // Corrected variable name
  const [loading, setLoading] = useState(true);
  const [userTrips, setUserTrips] = useState([]);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }

    const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));

    try {
      const querySnapshot = await getDocs(q);
      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({ id: doc.id, ...doc.data() }); // Include doc.id for unique key
      });
      setUserTrips(trips);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch trips. Please try again later."); // Set error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 w-screen'>
      <h2 className='font-bold text-3xl'>My Trips</h2>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div> // Display error message
      ) : userTrips.length > 0 ? (
        <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
          {userTrips.map((trip) => (
            <UserTripCardItem trip={trip} key={trip.id} /> // Use trip.id as key
          ))}
        </div>
      ) : (
        <div className='mt-10'>No Trips found.  <Link to="/create-trip" className="text-blue-500 underline">
        Create Now
      </Link></div>
      )}
    </div>
  );
}

export default MyTrips;