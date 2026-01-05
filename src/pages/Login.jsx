import { useState, useEffect } from "react";
import loginBg from "../assets/login-bg2.jpg";
import emblem from "../assets/emblem.png";

function Login() {
  const [method, setMethod] = useState("password");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [timer, setTimer] = useState(0);
  const [captcha, setCaptcha] = useState({});
  const [captchaInput, setCaptchaInput] = useState("");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10 + 1);
    const b = Math.floor(Math.random() * 10 + 1);
    setCaptcha({ a, b, answer: a + b });
    setCaptchaInput("");
  };

  const sendOtp = () => {
    setTimer(30);
    alert("OTP sent (Demo)");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (parseInt(captchaInput) !== captcha.answer) {
      alert("Invalid Captcha");
      generateCaptcha();
      return;
    }

    localStorage.setItem("user", JSON.stringify({ mobile }));
    alert("Login Successful");
  };

  return (
    <div
      style={{
        ...styles.page,
        backgroundImage: `linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url(${loginBg})`
      }}
    >
      <div
        style={{
          ...styles.card,
          opacity: fade ? 1 : 0,
          transform: fade ? "translateY(0)" : "translateY(20px)"
        }}
      >
        <img src={emblem} alt="Emblem" style={styles.watermark} />

        <h2 style={styles.heading}>Login</h2>
        <p style={styles.subHeading}>
          Inner Line Permit – Arunachal Pradesh
        </p>

        <form onSubmit={handleLogin}>
          <input
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            style={styles.input}
          />

          <div style={styles.radioGroup}>
            <label>
              <input
                type="radio"
                checked={method === "password"}
                onChange={() => setMethod("password")}
              /> Password
            </label>

            <label>
              <input
                type="radio"
                checked={method === "otp"}
                onChange={() => setMethod("otp")}
              /> OTP
            </label>
          </div>

          {method === "password" && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          )}

          {method === "otp" && (
            <>
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.input}
              />

              {timer === 0 ? (
                <button type="button" onClick={sendOtp} style={styles.linkBtn}>
                  Send OTP
                </button>
              ) : (
                <p style={styles.timer}>Resend OTP in {timer}s</p>
              )}
            </>
          )}

          <div style={styles.captchaBox}>
            <span>{captcha.a} + {captcha.b} =</span>
            <input
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              style={styles.captchaInput}
            />
          </div>

          <button type="submit" style={styles.button}>
            Login
          </button>

          <div style={styles.footerLinks}>
            <span style={styles.link}>Forgot Password?</span>
          </div>
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
    width: 380,
    background: "#fff",
    padding: 30,
    borderRadius: 8,
    boxShadow: "0 8px 25px rgba(0,0,0,.3)",
    position: "relative",
    transition: "all .6s ease"
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
    marginBottom: 20
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "8px 0",
    borderRadius: 4,
    border: "1px solid #ccc"
  },
  radioGroup: {
    display: "flex",
    justifyContent: "space-around",
    margin: "10px 0"
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
    cursor: "pointer"
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#0b5ed7",
    cursor: "pointer",
    fontSize: 13
  },
  footerLinks: {
    marginTop: 10,
    textAlign: "center"
  },
  link: {
    fontSize: 13,
    color: "#0b5ed7",
    cursor: "pointer"
  },
  timer: {
    fontSize: 12,
    color: "#dc3545"
  }
};

export default Login;