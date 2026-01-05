import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (id === "admin" && password === "admin123") {
      localStorage.setItem("admin", "true");
      navigate("/admin-dashboard");
    } else {
      setError("Invalid Admin Credentials");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>
          <input
            placeholder="Admin ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Login
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
    background: "#f4f6f9"
  },
  card: {
    width: 320,
    padding: 25,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "10px 0"
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#0b5ed7",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer"
  },
  error: {
    color: "red",
    fontSize: 13
  }
};

export default AdminLogin;