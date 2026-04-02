import React, { useState, useEffect } from "react";
import "./accessibility.css";
import Ashok from "./assets/ashok.png";
import APStateLogo from "./assets/logoAPState.png";

const Accessibility = () => {

  const [time, setTime] = useState(new Date());
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('#1976d2');

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const increaseFont = () => {
    setFontSize(fontSize + 2);
  };

  const decreaseFont = () => {
    setFontSize(fontSize - 2);
  };

  const resetFont = () => {
    setFontSize(16);
  };

  const setTheme1 = () => setTheme('#4caf50');
  const setTheme2 = () => setTheme('#2196f3');
  const setTheme3 = () => setTheme('#0d47a1');

  const dateOptions = {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return (
    <div>
      <div className="accessibility-header" style={{ fontSize: `${fontSize}px`, background: theme }}>

        <div className="left-section">
          <span>📅 {time.toLocaleDateString("en-IN", dateOptions)}</span>
          <span className="time">⏰ {time.toLocaleTimeString()}</span>
        </div>

        <div className="right-section">
          <a href="#">Sitemap</a>

          <div className="font-controls">
            <button onClick={decreaseFont}>A-</button>
            <button onClick={resetFont}>A</button>
            <button onClick={increaseFont}>A+</button>
          </div>

          <div className="theme">
            <span>Theme?</span>
            <button className="theme1" onClick={setTheme1}>1</button>
            <button className="theme2" onClick={setTheme2}>2</button>
            <button className="theme3" onClick={setTheme3}>3</button>
          </div>
        </div>

      </div>

      <div className="bottom-header">
        <div className="left-section">
          {/* Left Section */}
           <img src={Ashok} alt="Indian Emblem" className="Emblem" />   
          <span className="phone">📞  155250 (Toll Free)</span>
        </div>

        {/* Center Section */}
        <div className="center-section">
          <h1>eILP</h1>
          <h3>Online Inner Line Permit System</h3>
          <p>• ONLY FOR INDIAN CITIZENS •</p>
        </div>

        {/* Right Section */}
        <div className="right-section">
           <img src={APStateLogo} alt="AP State Logo" className="LOGO" />
          <span className="email"> 📧 nodal[dot]eilp[at]gov[dot]com</span>
        </div>
      </div>
    </div>
  );
};

export default Accessibility