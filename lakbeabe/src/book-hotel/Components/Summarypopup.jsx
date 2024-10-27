import React from "react";

function SummaryPopup({ bookingDetails, onClose, onConfirm, showCalendarReminder, setShowCalendarReminder }) {
  return (
    <div className="summary-popup-overlay">
      <div className="summary-popup">
        <h2>Booking Summary</h2>
        <p><strong>Hotel Name:</strong> {bookingDetails.hotelName}</p>
        <p><strong>Check-in Date:</strong> {new Date(bookingDetails.checkInDate).toLocaleDateString()}</p>
        <p><strong>Check-out Date:</strong> {new Date(bookingDetails.checkOutDate).toLocaleDateString()}</p>
        <p><strong>Number of Adults:</strong> {bookingDetails.numberOfAdults}</p>
        <p><strong>Number of Children:</strong> {bookingDetails.numberOfChildren}</p>
        <p><strong>Bed Type:</strong> {bookingDetails.bedType}</p>
        <p><strong>Total Price:</strong> ₱ {bookingDetails.totalPrice.toLocaleString()}</p>

        <div className="calendar-reminder">
          <label>
            <input
              type="checkbox"
              checked={showCalendarReminder}
              onChange={(e) => setShowCalendarReminder(e.target.checked)}
            />
            Remind me the booking on my Google Calendar
          </label>
          <a href="/policy">
          <span className="info-icon" title="Checking this box will allow us to access your Google Calendar to add the booking event.">
            &#9432;
          </span>
          </a>
        </div>

        <div className="popup-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm Booking</button>
        </div>
      </div>
    </div>
  );
}

export default SummaryPopup;