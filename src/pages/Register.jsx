import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/login-bg2.jpg";
import emblem from "../assets/emblem.png";

function Register() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Captcha
  const [captcha, setCaptcha] = useState({});
  const [captchaInput, setCaptchaInput] = useState("");

  // Animation
  const [fade, setFade] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setFade(true);
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10 + 1);
    const b = Math.floor(Math.random() * 10 + 1);
    setCaptcha({ a, b, answer: a + b });
    setCaptchaInput("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.mobile ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (parseInt(captchaInput) !== captcha.answer) {
      setError("Invalid captcha");
      generateCaptcha();
      return;
    }

    localStorage.setItem("registeredUser", JSON.stringify(form));
    setSuccess("Registration successful! Redirecting to login...");

    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div
      style={{
        ...styles.page,
        backgroundImage: `linear-gradient(
          rgba(0,0,0,0.6),
          rgba(0,0,0,0.6)
        ), url(${loginBg})`
      }}
    >
      <div
        style={{
          ...styles.card,
          opacity: fade ? 1 : 0,
          transform: fade ? "translateY(0)" : "translateY(20px)"
        }}
      >
        {/* WATERMARK */}
        <img src={emblem} alt="Emblem" style={styles.watermark} />

        <h2 style={styles.heading}>User Registration</h2>
        <p style={styles.subHeading}>
          Inner Line Permit – Arunachal Pradesh
        </p>

        <form onSubmit={handleRegister}>
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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />

          {/* CAPTCHA */}
          <div style={styles.captchaBox}>
            <span>{captcha.a} + {captcha.b} =</span>
            <input
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              style={styles.captchaInput}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundSize: "cover"
  },
  card: {
    width: 400,
    background: "#fff",
    padding: 30,
    borderRadius: 8,
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    position: "relative",
    transition: "all 0.6s ease"
  },
  watermark: {
    position: "absolute",
    width: 150,
    opacity: 0.06,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none"
  },
  heading: {
    textAlign: "center",
    color: "#0b5ed7"
  },
  subHeading: {
    textAlign: "center",
    fontSize: 13,
    color: "#666",
    marginBottom: 20
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "8px 0",
    borderRadius: 4,
    border: "1px solid #ccc"
  },
  captchaBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 10
  },
  captchaInput: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: 12,
    marginTop: 15,
    background: "#0b5ed7",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 16
  },
  error: {
    color: "#dc3545",
    fontSize: 13,
    marginTop: 10
  },
  success: {
    color: "#198754",
    fontSize: 13,
    marginTop: 10
  }
};

export default Register;