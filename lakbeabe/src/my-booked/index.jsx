import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserBookingsCardItem from './components/UserBookingsCardItem';

function BookedHotel() {
  const navigate = useNavigate();
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUserBookings = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/'); // Redirect if no user is found
        return;
      }

      try {
        const q = query(collection(db, 'UserBookings'), where('userEmail', '==', user.email));
        const querySnapshot = await getDocs(q);
        const bookings = [];
        
        querySnapshot.forEach((doc) => {
          bookings.push({ id: doc.id, ...doc.data() });
        });

        setUserBookings(bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserBookings();
  }, [navigate]);

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 w-screen'>
      <h2 className='font-bold text-3xl'>Booked Hotels</h2>
      
      {loading ? (
        <div>Loading...</div> // Loading indicator
      ) : (
        <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
          {userBookings.length > 0 ? (
            userBookings.map((booking) => (
              <UserBookingsCardItem hotelbooked={booking} key={booking.id} />
            ))
          ) : (
            <div>No bookings found.  <Link to="/create-trip" className="text-blue-500 underline">
            Book Now
          </Link></div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookedHotel;
