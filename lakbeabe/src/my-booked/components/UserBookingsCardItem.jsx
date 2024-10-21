import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function UserBookingsCardItem({ hotelbooked }) {
  const [photoUrl, setPhotoUrl] = useState();

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

  console.log('Hotel booked data:', hotelbooked);

  return (
    <Link 
    to={`/HotelBooking?hotelName=${encodeURIComponent(hotelbooked.hotelName)}&price=${hotelbooked.price}&desc=${hotelbooked.description}&imageURL=${encodeURIComponent(photoUrl)}&address=${encodeURIComponent(hotelbooked.address)}`}
    >
        
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
          
          <h2 className='text-sm text-gray-500'>
            <b><i>CLICK TO BOOK AGAIN</i></b> 
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserBookingsCardItem;
