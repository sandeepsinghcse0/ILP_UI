import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import emblem from "../assets/ashok.png";
import stateLogo from "../assets/logoAPState.png";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState("#1976d2");

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("registeredUser"));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Font Controls
  const increaseFont = () => setFontSize((f) => f + 2);
  const decreaseFont = () => setFontSize((f) => f - 2);
  const resetFont = () => setFontSize(16);

  // Theme
  const setTheme1 = () => setTheme("#4caf50");
  const setTheme2 = () => setTheme("#2196f3");
  const setTheme3 = () => setTheme("#0d47a1");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const dateOptions = {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return (
    <div style={{ fontSize: `${fontSize}px` }}>
      
      {/* 🔹 TOP BAR */}
      <div className="accessibility-header" style={{ background: theme }}>
        <div className="left-section">
          <span>📅 {time.toLocaleDateString("en-IN", dateOptions)}</span>
          <span>⏰ {time.toLocaleTimeString()}</span>
        </div>

        <div className="right-section">
          <a href="#">Sitemap</a>

          <div className="font-controls">
            <li>
            <button onClick={decreaseFont}>A-</button>
            <button onClick={resetFont}>A</button>
            <button onClick={increaseFont}>A+</button>
            </li>
          </div>

          <div className="theme">
            <span>Theme</span>
            <button className="theme1" onClick={setTheme1}>1</button>
            <button className="theme2" onClick={setTheme2}>2</button>
            <button className="theme3" onClick={setTheme3}>3</button>
          </div>
        </div>
      </div>

      {/* 🔹 MAIN HEADER */}
      <div className="mainHeader">
        <div className="leftLogo">
          <img src={emblem} alt="India Logo" />
          <p>📞 155250 (Toll Free)</p>
        </div>

        <div className="centerText">
          <h1>eILP</h1>
          <h3>Online Inner Line Permit System</h3>
          <p>• ONLY FOR INDIAN CITIZENS •</p>
        </div>

        <div className="rightLogo">
          <img src={stateLogo} alt="State Logo" />
          <p>📧 nodal[dot]eilp[at]gov[dot]com</p>
        </div>
      </div>

      {/* 🔹 NAVBAR */}
      <div className="navbar">
        <button className="tourist">Tourist eILP ⬇</button>

        {!user ? (
          <>
            <Link to="/login" className="navBtn">Login</Link>
            <Link to="/register" className="navBtn">Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="navBtn">Profile</Link>
            <button onClick={handleLogout} className="logout">Logout</button>
          </>
        )}

        <button className="loginBtn">
          Login for Print & Payment
        </button>
      </div>
    </div>
  );
}

export default Header;