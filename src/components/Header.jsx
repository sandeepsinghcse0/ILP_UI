import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import emblem from "../assets/emblem.png";

function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 720 : false
  );

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("registeredUser"));

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 720);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((v) => !v);

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <img src={emblem} alt="Emblem" style={styles.logoImg} />
        <div>
          <h2 style={styles.title}>Inner Line Permit</h2>
          <p style={styles.subtitle}>Government of Arunachal Pradesh</p>
        </div>
      </div>

      {/* Desktop nav */}
      {!isMobile && (
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          <Link to="/tourist-places" style={styles.link}>
            Tourist Places
          </Link>
          <Link to="/apply-ilp" style={styles.applyBtn}>
            Apply ILP
          </Link>

          {!user && (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/register" style={styles.link}>
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link to="/profile" style={styles.link}>
                Profile
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          )}
        </nav>
      )}

      {/* Mobile burger */}
      {isMobile && (
        <div style={styles.mobileControls}>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={toggleMenu}
            style={styles.burgerBtn}
          >
            <span style={styles.burgerLine} />
            <span style={styles.burgerLine} />
            <span style={styles.burgerLine} />
          </button>
        </div>
      )}

      {/* Mobile dropdown */}
      {isMobile && open && (
        <nav style={styles.mobileNav} role="menu">
          <Link to="/" style={styles.mobileLink} onClick={closeMenu}>
            Home
          </Link>
          <Link to="/tourist-places" style={styles.mobileLink} onClick={closeMenu}>
            Tourist Places
          </Link>
          <Link to="/apply-ilp" style={{ ...styles.mobileLink, ...styles.applyBtnMobile }} onClick={closeMenu}>
            Apply ILP
          </Link>

          {!user && (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" style={styles.mobileLink} onClick={closeMenu}>
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link to="/profile" style={styles.mobileLink} onClick={closeMenu}>
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                style={{ ...styles.logoutBtn, width: "100%", marginTop: 6 }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    background: "linear-gradient(90deg, #084298, #0b5ed7)",
    color: "#fff",
    position: "relative",
    zIndex: 50
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
  title: { margin: 0, fontSize: 18 },
  subtitle: { margin: 0, fontSize: 11 },
  nav: { display: "flex", gap: 16, alignItems: "center" },
  link: { color: "#fff", textDecoration: "none", padding: "6px 8px" },
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
  },

  /* Mobile specific styles */
  mobileControls: { display: "flex", alignItems: "center" },
  burgerBtn: {
    background: "transparent",
    border: "none",
    padding: 6,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    justifyContent: "center",
    cursor: "pointer"
  },
  burgerLine: {
    width: 22,
    height: 2,
    background: "#fff",
    display: "block",
    borderRadius: 2
  },
  mobileNav: {
    position: "absolute",
    top: "100%",
    right: 14,
    left: 14,
    background: "#fff",
    color: "#0b5ed7",
    borderRadius: 8,
    padding: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 8
  },
  mobileLink: {
    color: "#0b5ed7",
    textDecoration: "none",
    padding: "8px 10px",
    borderRadius: 6,
    display: "block",
    background: "transparent",
    textAlign: "left"
  },
  applyBtnMobile: {
    background: "#0b5ed7",
    color: "#fff",
    padding: "8px 10px",
    borderRadius: 6,
    textAlign: "center",
    fontWeight: 600
  }
};

export default Header;