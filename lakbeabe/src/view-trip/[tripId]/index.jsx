import { React, useState, useEffect } from 'react';
import InfoSection from '../components/InfoSection';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  // Used to get Trip Information from Firebase
  const GetTripData = async () => {
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No Such Document");
      toast("No trip Found!");
    }
  };

  // Function to handle hotel booking
  const handleHotelBooking = async (hotel) => {
    // Retrieve user email from local storage
    const userEmail = localStorage.getItem('user');

    if (!userEmail) {
      console.error("User email not found in local storage.");
      toast("Please log in to book a hotel.");
      return;
    }

    // Save booking details to Firebase
    const bookingRef = doc(db, "UserBookings", userEmail); // Assuming email is unique

    await setDoc(bookingRef, {
      hotelName: hotel.name,
      bookedAt: new Date().toISOString(),
    });

    // Redirect to the booking form with hotel details
    navigate('/booking', { state: { hotel } });
  };

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/* Information Section */}
      <InfoSection trip={trip} />
      {/* Recommended Hotels */}
      <Hotels trip={trip} onHotelClick={handleHotelBooking} />
      {/* Daily Plan Section */}
      <PlacesToVisit trip={trip} />
      {/* Footer */}
      <Footer trip={trip} />
    </div>
  );
}

export default Viewtrip;