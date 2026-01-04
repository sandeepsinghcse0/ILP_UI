import { useState, useEffect } from "react";

function ApplyILP() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    gender: "",
    citizenship: "",
    aadhaar: "",
    dob: "",
    state: "",
    district: "",
    pincode: ""
  });

  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        mobile: user.mobile || "",
        email: user.email || "",
        address: user.addresses?.[0]?.line1 || "",
        state: user.addresses?.[0]?.state || "",
        district: user.addresses?.[0]?.district || "",
        pincode: user.addresses?.[0]?.pincode || ""
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    for (let key in form) {
      if (!form[key]) {
        setMessage("All fields are required");
        return;
      }
    }

    // Save mock ILP application
    const existing = JSON.parse(localStorage.getItem("ilpApplications")) || [];

    localStorage.setItem("ilpApplications", JSON.stringify([...existing, form]));

    setMessage("ILP Application submitted successfully!");

    setForm({
      name: "",
      mobile: "",
      email: "",
      address: "",
      gender: "",
      citizenship: "Indian",
      aadhaar: "",
      dob: "",
      state: "",
      district: "",
      pincode: ""
    });
  };

  return (
    <div style={styles.container}>
      <h2>Apply for Inner Line Permit (ILP)</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="mobile"
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="dob"
          type="date"
          placeholder="Date of Birth"
          value={form.dob}
          onChange={handleChange}
          style={styles.input}
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={handleChange}
          style={styles.textarea}
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="district"
          placeholder="District"
          value={form.district}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="citizenship"
          placeholder="Citizenship"
          value={form.citizenship}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="aadhaar"
          placeholder="Aadhaar Number"
          value={form.aadhaar}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Submit Application
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: "50px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 6
  },
  input: {
    width: "100%",
    padding: 8,
    margin: "8px 0"
  },
  textarea: {
    width: "100%",
    padding: 8,
    margin: "8px 0",
    minHeight: 80
  },
  button: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    cursor: "pointer"
  },
  message: {
    color: "green",
    marginTop: 10
  }
};

export default ApplyILP;
