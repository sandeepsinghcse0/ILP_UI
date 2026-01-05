import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ApplyILP from "./pages/ApplyILP";
import TouristPlaces from "./pages/TouristPlaces";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
// import FamilyDetails from "./pages/FamilyDetails";

function App() {
  return (
    <div style={styles.page}>
      <Header />

      <main style={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/apply-ilp" element={<ApplyILP />} />
          {/* <Route path="/family-details" element={<FamilyDetails />} /> */}
          <Route path="/tourist-places" element={<TouristPlaces />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: 1
  }
};

export default App;
