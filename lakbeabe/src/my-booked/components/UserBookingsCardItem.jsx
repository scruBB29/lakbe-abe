import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

function UserBookingsCardItem({ hotelbooked }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [isAccepted, setIsAccepted] = useState(hotelbooked?.isAccepted || false);

  // Function to format the createdAt date
  const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const monthIndex = date.getMonth(); // 0-indexed (0 = January)
    const day = date.getDate();

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthName = monthNames[monthIndex];
    return `${year}-${monthName}-${day}`;
  };

  useEffect(() => {
    if (hotelbooked) {
      GetPlacePhoto();
    }
  }, [hotelbooked]);

  const GetPlacePhoto = async () => {
    try {
      // Use hotelbooked data to fetch photo if needed
      const data = {
        textQuery: hotelbooked?.hotelName || hotelbooked?.userSelection?.location?.label,
      };
      const resp = await GetPlaceDetails(data);
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[0].name);
      setPhotoUrl(PhotoUrl);
    } catch (error) {
      console.error("Error fetching place photo:", error);
    }
  };

  const handleCancelBooking = async () => {
    try {
      // Remove the booking from Firestore
      await deleteDoc(doc(db, "UserBookings", hotelbooked.id));
      console.log('Booking cancelled and removed from Firestore');
      setIsAccepted(false);
      window.location.reload();
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  return (
    <div className='hover:scale-105 transition-all'>
      <img 
        src={photoUrl || '/placeholder.jpg'} 
        className="object-cover rounded-xl h-[220px] w-full" 
        alt={hotelbooked?.hotelName || "Placeholder"} 
      />
      <div>  
        <h2 className='font-bold text-lg'>{hotelbooked?.hotelName}</h2>
        <h2 className='text-sm text-gray-500'>
          <b>{hotelbooked?.address}</b> 
        </h2>
        <h2 className='text-sm text-gray-500'>
          Cheked-In: <b>{formatCreatedAt(hotelbooked?.checkInDate)}</b> 
        </h2>
        <h2 className='text-sm text-gray-500'>
          Cheked-Out: <b>{formatCreatedAt(hotelbooked?.checkOutDate)}</b> 
        </h2>
        <h2 className='text-sm text-gray-500'>
          Bed Type: <b>{hotelbooked?.bedType}</b> 
        </h2>
        <h2 className='text-sm text-gray-500'>
          Guests: <b>{hotelbooked?.numberOfAdults} Adults with {hotelbooked?.numberOfChildren} Children.</b> 
        </h2>
        <h2 className='text-sm text-gray-500'>
          Price: <b>PHP {hotelbooked?.price}</b> 
        </h2>
        <h2 className='text-sm text-gray-500'>
          Total Price: <b>PHP {hotelbooked?.totalPrice}</b> 
        </h2>
        
        {isAccepted ? (
          <Link 
            to={{
              pathname: '/hotelBooking',
              search: `?hotelName=${encodeURIComponent(hotelbooked.hotelName)}&price=${hotelbooked.price}&desc=${hotelbooked.description}&imageURL=${encodeURIComponent(photoUrl)}&address=${encodeURIComponent(hotelbooked.address)}`
            }}
          >
            <h2 className='text-sm text-blue'>
              <b><i>CLICK HERE BOOK AGAIN</i></b> 
            </h2>
          </Link>
        ) : (
          <>
            <h2 className='text-sm text-gray-500'>
              <b><i>IN PROGRESS</i></b> 
            </h2>
            <button onClick={handleCancelBooking} className="text-red-500 underline text-xs p-1">
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default UserBookingsCardItem;