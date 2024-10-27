import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingForm.css";


function BookingForm({
  hotelName,
  address,
  price,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  numberOfAdults,
  setNumberOfAdults,
  numberOfChildren,
  setNumberOfChildren,
  bedType,
  bedTypes,
  adjustGuestCountByBedType,
  totalPrice,
  handleSubmit,
  isDateBooked,
  today,
}) {
  return (
    <div className="booking-form w-2/3 p-4">
      <div className="hotel-details">
        <h1 className="text-2xl font-bold mb-4">Booking for {hotelName}</h1>
        <h2 className="text-lg mb-2">Address: <b>{address}</b></h2>
        <h3 className="text-md mb-4">Price: <b>₱{price} per night</b></h3>
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
            filterDate={(date) => !isDateBooked(date)}
            minDate={
              startDate
                ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                : today
            }
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
            minDate={
              startDate
                ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                : today
            }
            dateFormat="MMMM d, yyyy"
            placeholderText="Select end date"
            filterDate={(date) => !isDateBooked(date)}
            className="transparent-datepicker"
          />
        </div>

        <div className="bed-type">
          <label>Bed Type:</label>
          <select
            value={bedType}
            onChange={(e) => adjustGuestCountByBedType(e.target.value)}
            className={`border border-gray-300 bg-transparent rounded-md p-2 ${
              !bedType ? "border-red-500" : ""
            }`}
          >
            <option value="" disabled>
              Select a bed type
            </option>
            {bedTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="guest-count mt-3">
          <label>Number of Adults:</label>
          <select
            id="adults"
            value={numberOfAdults}
            onChange={(e) => setNumberOfAdults(Number(e.target.value))}
            className="border border-gray-300 bg-transparent rounded-md p-2"
          >
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
        </div>

        <div className="guest-count">
          <label>Number of Children:</label>
          <select
            id="children"
            value={numberOfChildren}
            onChange={(e) => setNumberOfChildren(Number(e.target.value))}
            className="border border-gray-300 bg-transparent rounded-md p-2"
          >
            <option>0</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Total Price: ₱ {totalPrice.toLocaleString()}
          </h3>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Book Now
        </button>
      </form>
    </div>
  );
}

export default BookingForm;