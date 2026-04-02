import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Form from "./form";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ApplyILP from "./pages/ApplyILP";
import TouristPlaces from "./pages/TouristPlaces";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import FamilyDetails from "./pages/FamilyDetails";
import ReviewPage from "./components/ReviewPage";
import PrintPDPF from "./components/PrintPDF";

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
          <Route path="/family" element={<FamilyDetails />} />
          <Route path="/review" element={<ReviewPage />} />
          {/* <Route path="/family-details" element={<FamilyDetails />} /> */}
          <Route path="/tourist-places" element={<TouristPlaces />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/print-pdf" element={<PrintPDPF />} />
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
