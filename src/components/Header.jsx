import { Link } from "react-router-dom";

function Header() {
  const user = JSON.parse(localStorage.getItem("user")) ||
               JSON.parse(localStorage.getItem("registeredUser"));
  return (
    <header style={styles.header}>
      <h3 style={styles.logo}>Govt of Arunachal Pradesh</h3>

      <nav>
        {user && <Link to="/profile" style={styles.link}>Profile</Link>}
        {!user && <Link to="/login" style={styles.link}>Login</Link>}
        {!user && <Link to="/register" style={styles.link}>Register</Link>}
        <Link to="/apply-ilp" style={styles.link}>Apply for ILP</Link>
        <Link to="/tourist-places" style={styles.link}>
          Tourist Places to Visit
        </Link>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#0b5ed7",
    color: "#fff"
  },
  logo: {
    margin: 0
  },
  link: {
    color: "#fff",
    marginLeft: 20,
    textDecoration: "none",
    fontWeight: "500"
  }
};

export default Header;
