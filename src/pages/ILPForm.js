import { useState } from "react";
import FamilyForm from "./FamilyDetails";
import { useNavigate } from "react-router-dom";

export default function ILPForm() {
  const navigate = useNavigate();

  const [withFamily, setWithFamily] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    purpose: "",
    duration: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("ILP Data:", formData);
    navigate("/family"); // next step
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>ILP Application Form</h2>

      <input
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="purpose"
        placeholder="Purpose of Visit"
        value={formData.purpose}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="duration"
        placeholder="Duration (days)"
        value={formData.duration}
        onChange={handleChange}
      />
      <br /><br />

      <label>
        <input
          type="checkbox"
          checked={withFamily}
          onChange={() => setWithFamily(!withFamily)}
        />
        Traveling with family
      </label>

      <br /><br />

      {/* CONDITIONAL FAMILY FORM */}
      {withFamily && <FamilyForm />}

      <br />
      <button onClick={handleSubmit}>Proceed</button>
    </div>
  );
}