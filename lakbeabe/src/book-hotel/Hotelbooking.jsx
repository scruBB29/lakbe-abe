import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './HotelBooking.css'; // Add your styles here

function HotelBooking() {
    const location = useLocation();
    const { hotel, maxGuests } = location.state || {};

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [numberOfGuests, setNumberOfGuests] = useState(1); // Unified guest count state

    // Assuming hotel.price is already a numeric value
    const hotelPrice = hotel?.price ? Number(hotel.price.replace(/PHP\s*|\s/g, '').replace(/,/g, '')) : 0; // Convert to number

    // Calculate total price based on number of days and guests
    const calculateTotalPrice = () => {
        if (startDate && endDate) {
            const timeDiff = endDate.getTime() - startDate.getTime(); // Difference in milliseconds
            const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Convert to days and include start date
            return hotelPrice * numberOfDays * numberOfGuests; // Total price calculation
        }
        return 0; // Return 0 if dates are not selected
    };

    const totalPrice = calculateTotalPrice(); // Calculate total price

    const handleSubmit = (e) => {
        e.preventDefault();
        if (startDate && endDate) {
            alert(`Booking from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} for ${numberOfGuests} guests. Total Price: ₱${totalPrice.toLocaleString()}`);
        } else {
            alert('Please select both start and end dates.');
        }
    };

    return (
        <div className="booking-container">
            <div className="hotel-details">
                <h1 className="text-2xl font-bold mb-4">Booking for {hotel?.hotelName}</h1>
                <h2 className="text-lg mb-2">Address: {hotel?.hotelAddress || 'N/A'}</h2>
                <h3 className="text-md mb-4">Price Range: ₱{hotel?.price || 'N/A'}</h3>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="date-picker">
                    <label>Check-in Date:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select start date"
                        className="transparent-datepicker"
                    />
                </div>
                <div className="date-picker">
                    <label>Check-out Date:</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate} // Prevent selecting an earlier end date
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select end date"
                        className="transparent-datepicker"
                    />
                </div>
                <div className="guest-count">
                    <label>Number of Guests:</label>
                    <select 
                        id="guests" 
                        value={numberOfGuests} 
                        onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                        className="border border-gray-300 bg-transparent rounded-md p-2"
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

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Book Now
                </button>
            </form>
        </div>
    );
}

export default HotelBooking;