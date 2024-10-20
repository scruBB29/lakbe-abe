import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

function HotelCardItem({ hotel }) {
    const [photoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        hotel && GetPlacePhoto();
    }, [hotel]);

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: hotel?.hotelName
        };
        const result = await GetPlaceDetails(data).then(resp => {
            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[0].name);
            setPhotoUrl(PhotoUrl);
        });
    };

    // Parse price range
    const parsePrice = (price) => {
        const prices = price.replace('PHP', '').split('-').map(Number);
        return {
            min: prices[0],
            max: prices.length > 1 ? prices[1] : prices[0], // If there's no max, use min
        };
    };

    const { min, max } = parsePrice(hotel?.price); // Extract min and max prices

    return (
        <Link 
            to="/hotelbooking" 
            state={{ 
                hotel,
                maxGuests: 4, // Assuming max guests per room is 4
                basePrice: min, // Pass minimum price
                maxPrice: max // Pass maximum price
            }} 
        >
            <div className='hover:scale-105 transition-all cursor-pointer'>
                <img 
                    src={photoUrl ? photoUrl : '/pampanga.jpg'} 
                    className='rounded-xl h-[180px] w-full object-cover' 
                />
                <div className='my-2 flex flex-col gap-2'>
                    <h2 className='font-medium'>{hotel?.hotelName}</h2>
                    <h2 className='text-xs text-gray-500'>📍 {hotel?.hotelAddress}</h2>
                    <h2 className='text-sm'>💰 {hotel?.price}</h2>
                    <h2 className='text-sm'>⭐ {hotel?.rating}</h2>
                </div>
            </div>
        </Link>
    );
}

export default HotelCardItem;