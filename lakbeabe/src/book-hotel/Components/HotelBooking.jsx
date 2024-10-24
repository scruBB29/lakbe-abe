import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Hotelbooking.css";
import { db } from "@/service/firebaseConfig";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import HotelDetails from "./HotelDetails";
import BookingForm from "./BookingForm";
import SuccessMessage from "./SuccessMessage";
import ErrorMessage from "./ErrorMessage";

function HotelBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const hotelName = queryParams.get('hotelName');
  const price = queryParams.get('price');
  const address = queryParams.get('address');
  const imageURL = queryParams.get('imageURL');
  const desc = queryParams.get('desc');

  const { hotel, maxGuests } = location.state || {};

  useEffect(() => {
    if (!hotel && !hotelName) {
      navigate('/create-trip');
    }
  }, [hotel, hotelName, navigate]);

  const [startDate, setStartDate] = useState(() => {
    return queryParams.has('startDate') ? new Date(queryParams.get('startDate')) : null;
  });
  const [endDate, setEndDate] = useState(() => {
    return queryParams.has('endDate') ? new Date(queryParams.get('endDate')) : null;
  });
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [bookedDates, setBookedDates] = useState([]);
  const [bedType, setBedType] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);

  const bedTypes = [
    "King size",
    "Queen size",
    "Double bed",
    "Triple bed",
    "Single bed",
    "Double-Double bed",
  ];

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
      setDescription(result.data.places[0].description || "No description available.");
    } catch (error) {
      console.error("Error fetching place photo:", error);
      setErrorMessage("Failed to fetch photo and description.");
    }
  };

  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const timeDiff = endDate.getTime() - startDate.getTime();
      const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
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
      if (data.isActive && data.isAccepted) {
        const checkInDate = new Date(data.checkInDate);
        const checkOutDate = new Date(data.checkOutDate);

        for (let d = checkInDate; d <= checkOutDate; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
      }
    });

    setBookedDates(dates);
  };

  const isDateBooked = (date) => {
    return bookedDates.some(
      (bookedDate) => bookedDate.toDateString() === date.toDateString()
    );
  };

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
        setNumberOfAdults(4);
        setNumberOfChildren(0);
        break;
      default:
        break;
    }
    setBedType(selectedBedType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!startDate || !endDate) {
      alert("Please select both check-in and check-out dates.");
      return;
    }
  
    if (isDateBooked(startDate) || isDateBooked(endDate)) {
      alert("Selected dates are already booked.");
      return;
    }
  
    if (!bedType) {
      alert("Please select a bed type.");
      return;
    }
  
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (!user || !user.userId) {
      alert("User ID is missing. Please log in again.");
      navigate('/login'); // Redirect to login page
      return;
    }
  
    const bookingData = {
      hotelName: hotel?.hotelName || hotelName,
      checkInDate: startDate.toISOString(),
      checkOutDate: endDate.toISOString(),
      numberOfAdults,
      numberOfChildren,
      totalPrice,
      userEmail: user?.email,
      userId: user?.userId, // Use userId from localStorage
      createdAt: new Date().toISOString(),
      bedType,
      photoUrl: hotel?.photoUrl || imageURL,
      description: hotel?.description || desc,
      address: hotel?.hotelAddress || address,
      price: hotel?.price || price,
      isActive,
      isAccepted
    };
  
    try {
      await addDoc(collection(db, "UserBookings"), bookingData);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Failed to save booking. Please try again.");
    }
  };

  useEffect(() => {
    if (queryParams.has('numberOfAdults')) {
      setNumberOfAdults(Number(queryParams.get('numberOfAdults')));
    }
    if (queryParams.has('numberOfChildren')) {
      setNumberOfChildren(Number(queryParams.get('numberOfChildren')));
    }
  }, [queryParams]);

  return (
    <div className="booking-container flex mt-20 mb-20">
      {showSuccessMessage && <SuccessMessage navigate={navigate} />}
      {errorMessage && <ErrorMessage message={errorMessage} />}

      <HotelDetails
        photoUrl={photoUrl || imageURL}
        description={hotel?.description || desc}
      />

      <BookingForm
        hotelName={hotel?.hotelName || hotelName}
        address={hotel?.hotelAddress || address}
        price={hotel?.price || price}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        numberOfAdults={numberOfAdults}
        setNumberOfAdults={setNumberOfAdults}
        numberOfChildren={numberOfChildren}
        setNumberOfChildren={setNumberOfChildren}
        bedType={bedType}
        bedTypes={bedTypes}
        adjustGuestCountByBedType={adjustGuestCountByBedType}
        totalPrice={totalPrice}
        handleSubmit={handleSubmit}
        isDateBooked={isDateBooked}
        today={today}
      />
    </div>
  );
}

export default HotelBooking;