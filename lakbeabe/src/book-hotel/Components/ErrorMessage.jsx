import React from "react";

function ErrorMessage({ message }) {
  return (
    <div className="error-message" style={{ color: "red" }}>
      {message}
    </div>
  );
}

export default ErrorMessage;