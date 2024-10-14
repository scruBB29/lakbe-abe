import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './HotelBooking.css'; // Add your styles here

function HotelBooking() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [guestCount, setGuestCount] = useState(1); // State for guest count

    const handleSubmit = (e) => {
        e.preventDefault();
        if (startDate && endDate) {
            alert(`Booking from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} for ${guestCount} guests.`);
        } else {
            alert('Please select both start and end dates.');
        }
    };

    return (
        <div className="booking-container">
            <h1>Hotel Booking</h1>
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
                    <input 
                        type="number" 
                        value={guestCount} 
                        onChange={(e) => setGuestCount(e.target.value)} 
                        min="1" 
                        className="guest-input transparent-input" // Add transparent-input class
                    />
                </div>
                <button type="submit" className="transparent-button">Book Now</button>
            </form>
        </div>
    );
}

export default HotelBooking;