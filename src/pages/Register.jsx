import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    setError("");
    setSuccess("");

    // Basic validation
    if (!form.name || !form.mobile || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    // Save mock user
    localStorage.setItem("registeredUser", JSON.stringify(form));
    setSuccess("Registration successful! Redirecting to login...");

    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div style={styles.container}>
      <h2>Customer Registration</h2>

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
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        style={styles.input}
      />

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <button onClick={handleRegister} style={styles.button}>
        Register
      </button>
    </div>
  );
}

const styles = {
  container: {
    width: 350,
    margin: "80px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 6
  },
  input: {
    width: "100%",
    padding: 8,
    margin: "10px 0"
  },
  button: {
    width: "100%",
    padding: 10,
    cursor: "pointer"
  },
  error: {
    color: "red",
    fontSize: 14
  },
  success: {
    color: "green",
    fontSize: 14
  }
};

export default Register;
