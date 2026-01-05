import { Link, useNavigate } from "react-router-dom";
import emblem from "../assets/emblem.png";

function Header() {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("registeredUser"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <img src={emblem} alt="Emblem" style={styles.logoImg} />
        <div>
          <h2 style={styles.title}>Inner Line Permit</h2>
          <p style={styles.subtitle}>Government of Arunachal Pradesh</p>
        </div>
      </div>

      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/tourist-places" style={styles.link}>Tourist Places</Link>
        <Link to="/apply-ilp" style={styles.applyBtn}>Apply ILP</Link>

        {!user && <Link to="/login" style={styles.link}>Login</Link>}
        {!user && <Link to="/register" style={styles.link}>Register</Link>}

        {user && (
          <>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 30px",
    background: "linear-gradient(90deg, #084298, #0b5ed7)",
    color: "#fff"
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 12
  },
  logoImg: {
    width: 42,
    height: 52
  },
  title: { margin: 0, fontSize: 20 },
  subtitle: { margin: 0, fontSize: 12 },
  nav: { display: "flex", gap: 16, alignItems: "center" },
  link: { color: "#fff", textDecoration: "none" },
  applyBtn: {
    background: "#fff",
    color: "#0b5ed7",
    padding: "6px 14px",
    borderRadius: 4,
    textDecoration: "none",
    fontWeight: 600
  },
  logoutBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer"
  }
};

export default Header;