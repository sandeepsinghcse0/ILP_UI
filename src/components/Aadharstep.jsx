import React, { useState } from "react";

const AadhaarStep = ({ nextStep }) => {
const [aadhaar, setAadhaar] = useState("");
const [error, setError] = useState("");

const handleSubmit = (e) => {
e.preventDefault();


if (!/^[0-9]{12}$/.test(aadhaar)) {
  setError("Aadhaar must contain exactly 12 digits");
  return;
}

nextStep(aadhaar);


};

return ( <form className="formBox" onSubmit={handleSubmit}> <h2>Enter Aadhaar Number</h2>

  <input
    type="text"
    maxLength="12"
    placeholder="Enter Aadhaar Number"
    value={aadhaar}
    onChange={(e) => setAadhaar(e.target.value)}
  />

  {error && <p className="error">{error}</p>}

  <button type="submit">Continue</button>
</form>

);
};

export default AadhaarStep;
