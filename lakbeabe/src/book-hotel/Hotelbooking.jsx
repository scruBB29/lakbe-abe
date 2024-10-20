import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Hotelbooking.css"; // Add your styles here
import { db } from "@/service/firebaseConfig"; // Adjust this import based on your project structure
import { addDoc, collection, query, where, getDocs } from "firebase/firestore"; // Import necessary Firestore functions
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";

function HotelBooking() {
  const location = useLocation();
  const { hotel, maxGuests } = location.state || {};

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [bookedDates, setBookedDates] = useState([]); // State for booked dates

  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.hotelName,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
      const PhotoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        resp.data.places[0].photos[0].name
      );
      setPhotoUrl(PhotoUrl);
    });
  };

  const hotelPrice = hotel?.price
    ? Number(hotel.price.replace(/PHP\s*|\s/g, "").replace(/,/g, ""))
    : 0;

  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const timeDiff = endDate.getTime() - startDate.getTime();
      const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      return hotelPrice * numberOfDays * (numberOfAdults + numberOfChildren);
    }
    return 0;
  };

  const totalPrice = calculateTotalPrice();

  useEffect(() => {
    fetchBookedDates();
  }, [hotel]);

  const fetchBookedDates = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const bookingsRef = collection(db, "UserBookings");
    const q = query(
      bookingsRef,
      where("hotelName", "==", hotel?.hotelName),
      where("userEmail", "==", user?.email)
    );

    const querySnapshot = await getDocs(q);
    let dates = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const checkInDate = new Date(data.checkInDate);
      const checkOutDate = new Date(data.checkOutDate);

      // Push all dates between check-in and check-out into the bookedDates array
      for (let d = checkInDate; d <= checkOutDate; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
    });

    setBookedDates(dates);
  };

  const isDateBooked = (date) => {
    return bookedDates.some(
      (bookedDate) => bookedDate.toDateString() === date.toDateString()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      const user = JSON.parse(localStorage.getItem("user"));

      const bookingData = {
        hotelName: hotel?.hotelName,
        checkInDate: startDate.toISOString(),
        checkOutDate: endDate.toISOString(),
        numberOfAdults,
        numberOfChildren,
        totalPrice,
        userEmail: user?.email,
        userId: user?.id,
        createdAt: new Date().toISOString(),
      };

      try {
        await addDoc(collection(db, "UserBookings"), bookingData);
        alert(
          `Booking confirmed from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} for ${numberOfAdults} adults and ${numberOfChildren} children. Total Price: ₱${totalPrice.toLocaleString()}`
        );
      } catch (error) {
        console.error("Error saving booking:", error);
        alert("Failed to save booking. Please try again.");
      }
    } else {
      alert("Please select both start and end dates.");
    }
  };

  return (
    <div className="booking-container flex mt-20 mb-20">
      <div className="hotel-image-description w-4/3 p-4">
        <img
          src={photoUrl ? photoUrl : "/pampanga.jpg"}
          alt={hotel?.hotelName}
          className="w-full h-auto rounded-lg mb-4"
        />
        <p className="text-md">
          {hotel?.description || "No description available."}
        </p>
      </div>

      <div className="booking-form w-2/3 p-4">
        <div className="hotel-details">
          <h1 className="text-2xl font-bold mb-4">
            Booking for {hotel?.hotelName}
          </h1>
          <h2 className="text-lg mb-2">
            Address: <b>{hotel?.hotelAddress || "N/A"}</b>
          </h2>
          <h3 className="text-md mb-4">
            Price: <b>₱{hotel?.price || "N/A"} per night</b>
          </h3>
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
              filterDate={(date) => !isDateBooked(date)} // Disable booked dates
              renderDayContents={(day, date) => {
                return (
                  <div className={isDateBooked(date) ? "occupied" : ""}>
                    {day}
                  </div>
                );
              }}
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
              minDate={startDate}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select end date"
              filterDate={(date) => !isDateBooked(date)} // Disable booked dates
              renderDayContents={(day, date) => {
                return (
                  <div className={isDateBooked(date) ? "occupied" : ""}>
                    {day}
                  </div>
                );
              }}
              className="transparent-datepicker"
            />
          </div>

          {/* Guest Count Section */}
          <div className="guest-count">
            <label>Number of Adults:</label>
            <select
              id="adults"
              value={numberOfAdults}
              onChange={(e) => setNumberOfAdults(Number(e.target.value))}
              className="border border-gray-300 bg-transparent rounded-md p-2"
            >
              {[...Array(maxGuests)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
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
              {[...Array(maxGuests)].map((_, index) => (
                <option key={index} value={index}>
                  {index}
                </option>
              ))}
            </select>
          </div>

          {/* Total Price Display */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Total Price: ₱ {totalPrice.toLocaleString()}
            </h3>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default HotelBooking;
