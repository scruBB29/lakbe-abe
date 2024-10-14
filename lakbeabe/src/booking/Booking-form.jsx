import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function HotelBooking() {
    const location = useLocation();
    const { hotel, maxGuests } = location.state || {};

    const [numberOfGuests, setNumberOfGuests] = useState(1);

    // Assuming hotel.price is already a numeric value
    const hotelPrice = hotel?.price ? Number(hotel.price.replace(/PHP\s*|\s/g, '').replace(/,/g, '')) : 0; // Convert to number
    const totalPrice = hotelPrice * numberOfGuests; // Calculate total based on number of guests

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Booking for {hotel?.hotelName}</h1>
            <h2 className="text-lg mb-2">Address: {hotel?.hotelAddress}</h2>
            <h3 className="text-md mb-4">Price Range: {hotel?.price}</h3>

            <div className="mb-4">
                <label htmlFor="guests" className="block text-sm font-medium mb-2">
                    Number of Guests:
                </label>
                <select 
                    id="guests" 
                    value={numberOfGuests} 
                    onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                    className="border border-gray-300  bg-transparent rounded-md p-2"
                >
                    {[...Array(maxGuests)].map((_, index) => (
                        <option key={index} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold">
                    Total Price: ₱ {totalPrice.toLocaleString()} {/* Format total price */}
                </h3>
            </div>

            <button 
                onClick={() => alert(`Booking confirmed for ${numberOfGuests} guest(s) at ${hotel?.hotelName}. Total Price: ₱${totalPrice.toLocaleString()}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Confirm Booking
            </button>
        </div>
    );
}

export default HotelBooking;