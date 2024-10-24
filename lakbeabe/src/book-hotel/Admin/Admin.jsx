import React, { useEffect, useState } from "react";
import { db } from "@/service/firebaseConfig";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import styles
import './AdminBookings.css'; // Ensure your CSS file is imported

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [startDate, setStartDate] = useState(null); // Start date for filtering
  const [endDate, setEndDate] = useState(null); // End date for filtering

  // Fetch bookings when the component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true); // Start loading
    try {
      const bookingsRef = collection(db, "UserBookings");
      const snapshot = await getDocs(bookingsRef);
      
      const bookingsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setBookings(bookingsList);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch bookings. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleAcceptBooking = async (id) => {
    try {
      await updateDoc(doc(db, "UserBookings", id), {
        isAccepted: true // Update the status to ACCEPTED
      });
      fetchBookings(); // Refresh the list after updating
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status. Please try again.");
    }
  };

  // Filter bookings based on selected dates
  const filteredBookings = bookings.filter(booking => {
    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);

    return (
      (!startDate || checkInDate >= new Date(startDate)) &&
      (!endDate || checkOutDate <= new Date(endDate))
    );
  });

  return (
    <div className="admin-bookings-container">
      <h1>Admin Bookings</h1>
      
      <div className='border border-gray-300 bg-transparent rounded-md mt-5 p-3 date-filters grid grid-cols-2 gap-20'>
        <label className="ml-auto">
          Start Date:
          <DatePicker 
            className='border border-gray-300 bg-transparent rounded-md  p-2 '
            selected={startDate} 
            onChange={(date) => setStartDate(date)} 
            dateFormat="yyyy-MM-dd"
          />
        </label>
        <label>
          End Date:
          <DatePicker 
            className='border border-gray-300 bg-transparent rounded-md p-2'
            selected={endDate} 
            onChange={(date) => setEndDate(date)} 
            dateFormat="yyyy-MM-dd"
          />
        </label>
      </div>

      {loading ? (
        <p>Loading bookings...</p> // Loading indicator
      ) : error ? (
        <p className="error-message">{error}</p> // Display error message
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>User Email</th>
              <th>Hotel Name</th>
              <th>Check-in Date</th>
              <th>Check-out Date</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.userEmail}</td>
                  <td>{booking.hotelName}</td>
                  <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => toggleActiveStatus(booking.id, booking.isActive)} 
                      className={`button1 ${booking.isActive ? "active-button" : "inactive-button"}`}
                    >
                      {booking.isActive ? "CO" : "CI"}
                    </button>
                  </td>
                  <td>
  {booking.isAccepted ? (
    'IN PROGRESS'
  ) : (
    <button onClick={() => handleAcceptBooking(booking.id)} className="button1 accept-button">
      Accept
    </button>
  )}
</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No bookings found.</td> {/* Message for no bookings */}
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminBookings;