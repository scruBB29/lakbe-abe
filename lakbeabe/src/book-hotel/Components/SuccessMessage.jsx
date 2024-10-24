import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

function SuccessMessage({ navigate }) {
  return (
    <div className="overlay">
      <div className="success-message animated">
        <FontAwesomeIcon icon={faCheckCircle} size="3x" color="green" />
        <h2 className="font-bold text-3xl m-5">Booking Successful!</h2>
        <button
          onClick={() => navigate("/my-bookings")}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Go to My Bookings
        </button>
      </div>
    </div>
  );
}

export default SuccessMessage;