import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Hotelbooking.css"; // Add your styles here
import { db } from "@/service/firebaseConfig"; // Adjust this import based on your project structure
import { addDoc, collection, query, where, getDocs } from "firebase/firestore"; // Import necessary Firestore functions
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

function HotelBooking() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate for navigation


   // Access query parameters
   const queryParams = new URLSearchParams(location.search);
   const hotelName = queryParams.get('hotelName');
   const price = queryParams.get('price');
   const address = queryParams.get('address');
   const imageURL = queryParams.get('imageURL');
   const desc = queryParams.get('desc');



  const { hotel, maxGuests,} = location.state || {};



  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [bookedDates, setBookedDates] = useState([]); // State for booked dates
  const [bedType, setBedType] = useState("");
  const [photoUrl, setPhotoUrl] = useState();
  const [description, setDescription] = useState(""); // State for 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const bedTypes = [
    "King size",
    "Queen size",
    "Double bed",
    "Triple bed",
    "Single bed",
    "Double-Double bed",
  ];

  // Get current date for minDate
  const today = new Date();

  useEffect(() => {
    hotel && GetPlacePhoto();
    fetchBookedDates();
  }, [hotel]);

  
const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.hotelName,
    };
    try {
      const result = await GetPlaceDetails(data);
      const PhotoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        result.data.places[0].photos[0].name
      );
      setPhotoUrl(PhotoUrl);
      setDescription(result.data.places[0].description || "No description available."); // Fetching description
    } catch (error) {
      console.error("Error fetching place photo:", error);
      setErrorMessage("Failed to fetch photo and description.");
    }
};



  // Calculate total price based on selected dates and guest count
  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const timeDiff = endDate.getTime() - startDate.getTime();
      const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        // Check if hotel.price is available, otherwise use price
    const hotelPrice =
    hotel && hotel.price
      ? Number(hotel.price.replace(/PHP\s*|\s/g, "").replace(/,/g, ""))
      : price
      ? Number(price.replace(/PHP\s*|\s/g, "").replace(/,/g, ""))
      : 0;


      return hotelPrice * numberOfDays * (numberOfAdults + numberOfChildren);
    }
    return 0;
  };
  const totalPrice = calculateTotalPrice();

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

  // Adjust guest count based on selected bed type
  const adjustGuestCountByBedType = (selectedBedType) => {
    switch (selectedBedType) {
      case "King size":
      case "Queen size":
      case "Double bed":
        setNumberOfAdults(2);
        setNumberOfChildren(0);
        break;
      case "Triple bed":
        setNumberOfAdults(3);
        setNumberOfChildren(0);
        break;
      case "Single bed":
        setNumberOfAdults(1);
        setNumberOfChildren(0);
        break;
      case "Double-Double bed":
        setNumberOfAdults(4); // Assuming it can accommodate up to 4 adults
        setNumberOfChildren(0); // Adjust as needed
        break;
      default:
        break;
    }
    setBedType(selectedBedType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    const bookingData = {
      hotelName: hotel?.hotelName || hotelName,
      checkInDate: startDate.toISOString(),
      checkOutDate: endDate.toISOString(),
      numberOfAdults,
      numberOfChildren,
      totalPrice,
      userEmail: user?.email,
      userId: user?.id,
      createdAt: new Date().toISOString(),
      bedType,
      photoUrl: imageURL,
      description: hotel?.description || desc,
      address: hotel?.hotelAddress || address,
      price: hotel?.price || price,
    };


    try {
      await addDoc(collection(db, "UserBookings"), bookingData);

      // Show success message
      console.log("Booking successful!"); // Debugging log
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Failed to save booking. Please try again.");
    }
  };

  useEffect(() => {
    // Set initial values if they are provided in the URL
    if (queryParams.has('numberOfAdults')) {
        setNumberOfAdults(Number(queryParams.get('numberOfAdults')));
    }
    if (queryParams.has('numberOfChildren')) {
        setNumberOfChildren(Number(queryParams.get('numberOfChildren')));
    }
 }, [queryParams]);

  return (
    <div className="booking-container flex mt-20 mb-20">
      {/* Success Message Overlay */}
      {showSuccessMessage && (
        <div className="overlay">
          <div className="success-message animated">
            <FontAwesomeIcon icon={faCheckCircle} size="3x" color="green" />
            <h2 className='font-bold text-3xl m-5' >Booking Successful!</h2>
            <button
              onClick={() => navigate("/my-bookings")}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Go to My Bookings
            </button>
            {/* Optional: Add a close button */}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="error-message" style={{ color: "red" }}>
          {errorMessage}
        </div>
      )}

      <div className="hotel-image-description w-4/3 p-4">
        <img
          src={photoUrl || imageURL}
          alt={hotel?.hotelName}
          className="w-full h-80 object-cover rounded-lg mb-4" // Set height to a fixed value
        />
        <p className="text-md">
          {hotel?.description || desc}
        </p>
      </div>

      <div className="booking-form w-2/3 p-4">
        <div className="hotel-details">
          <h1 className="text-2xl font-bold mb-4">
            Booking for {hotel?.hotelName || hotelName}
          </h1>
          <h2 className="text-lg mb-2">
            Address: <b>{hotel?.hotelAddress || address}</b>
          </h2>
          <h3 className="text-md mb-4">
            Price: <b>₱{hotel?.price || price} per night</b>
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
              minDate={
                startDate
                  ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                  : today
              } // Disable past dates
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
              } // Disable past dates and ensure end date is after start date
              dateFormat="MMMM d, yyyy"
              placeholderText="Select end date"
              filterDate={(date) => !isDateBooked(date)} // Disable booked dates
              className="transparent-datepicker"
            />
          </div>

          {/* Bed Type Section */}
          <div className="bed-type">
            <label>Bed Type:</label>
            <select
              value={bedType}
              onChange={(e) => adjustGuestCountByBedType(e.target.value)}
              className={`border border-gray-300 bg-transparent rounded-md p-2 ${
                !bedType ? "border-red-500" : ""
              }`} // Highlight border if not selected
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

          {/* Guest Count Section */}
          <div className="guest-count mt-3">
            <label>Number of Adults:</label>
            <select
              id="adults"
              value={numberOfAdults}
              onChange={(e) => setNumberOfAdults(Number(e.target.value))}
              className="border border-gray-300 bg-transparent rounded-md p-2"
            >
              {/* {[...Array(maxGuests)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))} */}
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
