import { Link } from "react-router-dom";
import heroImg from "../assets/image1.png";
import img1 from "../assets/image1.png";
import img2 from "../assets/image2.png";
import img3 from "../assets/image3.png";
import img4 from "../assets/image4.png";

function Home() {
  const places = [
    { name: "Tawang", img: img1 },
    { name: "Ziro Valley", img: img2 },
    { name: "Bomdila", img: img3 },
    { name: "Dirang", img: img4 }
  ];

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          backgroundImage: `linear-gradient(
            rgba(0,0,0,0.55),
            rgba(0,0,0,0.55)
          ), url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          padding: "0 8%"
        }}
      >
        <div style={{ color: "#fff", maxWidth: 650 }}>
          <h1 style={{ fontSize: 42, marginBottom: 10 }}>
            Inner Line Permit (ILP)
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 20 }}>
            Official portal of the Government of Arunachal Pradesh for
            issuing Inner Line Permits to Indian citizens.
          </p>

          <div style={{ display: "flex", gap: 15 }}>
            <Link to="/apply-ilp" style={styles.primaryBtn}>
              Apply for ILP
            </Link>

            <Link to="/tourist-places" style={styles.secondaryBtn}>
              Explore Arunachal
            </Link>
          </div>
        </div>
      </section>

      {/* ================= INFO STRIP ================= */}
      <section style={styles.infoStrip}>
        <div style={styles.infoBox}>
          <h3>100% Online</h3>
          <p>Apply ILP digitally without visiting offices</p>
        </div>

        <div style={styles.infoBox}>
          <h3>Fast Approval</h3>
          <p>Quick processing with transparent status</p>
        </div>

        <div style={styles.infoBox}>
          <h3>Secure</h3>
          <p>Government-grade data protection</p>
        </div>
      </section>

      {/* ================= EXPLORE ARUNACHAL ================= */}
      <section style={styles.exploreSection}>
        <h2 style={styles.exploreHeading}>Explore Arunachal Pradesh</h2>
        <p style={styles.exploreSub}>
          Discover breathtaking destinations and rich cultural heritage
        </p>

        <div style={styles.cardGrid}>
          {places.map((place, index) => (
            <div key={index} style={styles.card}>
              <img src={place.img} alt={place.name} style={styles.cardImg} />
              <div style={styles.cardTitle}>{place.name}</div>
            </div>
          ))}
        </div>

        <Link to="/tourist-places" style={styles.exploreBtn}>
          View All Tourist Places
        </Link>
      </section>
    </div>
  );
}

const styles = {
  primaryBtn: {
    background: "#ffc107",
    color: "#000",
    padding: "12px 20px",
    textDecoration: "none",
    fontWeight: 600,
    borderRadius: 4
  },
  secondaryBtn: {
    border: "2px solid #fff",
    color: "#fff",
    padding: "10px 18px",
    textDecoration: "none",
    fontWeight: 500,
    borderRadius: 4
  },
  infoStrip: {
    display: "flex",
    justifyContent: "space-around",
    padding: "40px 10%",
    background: "#f8f9fa",
    textAlign: "center"
  },
  infoBox: {
    maxWidth: 220
  },
  exploreSection: {
    padding: "60px 8%",
    background: "#ffffff",
    textAlign: "center"
  },
  exploreHeading: {
    fontSize: 28,
    color: "#0b5ed7",
    marginBottom: 10
  },
  exploreSub: {
    color: "#555",
    marginBottom: 40
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    maxWidth: 1100,
    margin: "0 auto"
  },
  card: {
    background: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
  },
  cardImg: {
    width: "100%",
    height: 170,
    objectFit: "cover"
  },
  cardTitle: {
    padding: 12,
    fontWeight: 600
  },
  exploreBtn: {
    display: "inline-block",
    marginTop: 40,
    padding: "12px 24px",
    background: "#0b5ed7",
    color: "#fff",
    textDecoration: "none",
    borderRadius: 5,
    fontWeight: 600
  }
};

export default Home;