import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockUser } from "./mockAuth";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [loginType, setLoginType] = useState("password");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    setError("");

    // Check user
    if (
      identifier !== mockUser.email &&
      identifier !== mockUser.mobile
    ) {
      setError("User not found");
      return;
    }

    // Password login
    if (loginType === "password") {
      if (password !== mockUser.password) {
        setError("Invalid password");
        return;
      }
    }

    // OTP login
    if (loginType === "otp") {
      if (otp !== mockUser.otp) {
        setError("Invalid OTP");
        return;
      }
    }

    // Success
    localStorage.setItem("user", JSON.stringify(mockUser));
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Mobile Number"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        style={styles.input}
      />

      <div style={styles.radioGroup}>
        <label>
          <input
            type="radio"
            checked={loginType === "password"}
            onChange={() => setLoginType("password")}
          />
          Password
        </label>

        <label>
          <input
            type="radio"
            checked={loginType === "otp"}
            onChange={() => setLoginType("otp")}
          />
          OTP
        </label>
      </div>

      {loginType === "password" ? (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      ) : (
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={styles.input}
        />
      )}

      {error && <p style={styles.error}>{error}</p>}

      <button onClick={handleLogin} style={styles.button}>
        Login
      </button>
    </div>
  );
}

const styles = {
  container: {
    width: 320,
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
  radioGroup: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 10
  },
  button: {
    width: "100%",
    padding: 10,
    cursor: "pointer"
  },
  error: {
    color: "red",
    fontSize: 14
  }
};

export default Login;
