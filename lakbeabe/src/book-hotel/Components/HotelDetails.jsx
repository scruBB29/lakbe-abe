import React from "react";

function HotelDetails({ photoUrl, description }) {
  return (
    <div className="hotel-image-description w-4/3 p-4">
      <img
        src={photoUrl}
        alt="Hotel"
        className="w-full h-80 object-cover rounded-lg mb-4"
      />
      <p className="text-md">{description}</p>
    </div>
  );
}

export default HotelDetails;