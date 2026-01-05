import { districts } from "./mockAuth";
import img1 from "../assets/image1.png";
import img2 from "../assets/image2.png";
import img3 from "../assets/image3.png";
import img4 from "../assets/image4.png";

function TouristPlaces() {
  const places = [
    {
      name: "Tawang",
      img: img1,
      desc: "Famous for Tawang Monastery, snow-clad mountains and scenic beauty."
    },
    {
      name: "Ziro Valley",
      img: img2,
      desc: "Known for lush green landscapes and the Apatani tribal culture."
    },
    {
      name: "Bomdila",
      img: img3,
      desc: "A serene hill station with monasteries and Himalayan views."
    },
    {
      name: "Dirang",
      img: img4,
      desc: "A peaceful valley with hot springs and cultural villages."
    }
  ];

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Tourist Places to Visit</h2>
      <p style={styles.subHeading}>
        Explore the natural beauty and cultural heritage of Arunachal Pradesh
      </p>

      <div style={styles.grid}>
        {places.map((place, index) => (
          <div key={index} style={styles.card}>
            <img src={place.img} alt={place.name} style={styles.image} />

            <div style={styles.cardBody}>
              <h3>{place.name}</h3>
              <p>{place.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// ...existing code...
const styles = {
  page: {
    padding: "50px 8%",
    background: "#f4f6f9",
    minHeight: "100vh"
  },
  heading: {
    textAlign: "center",
    color: "#0b5ed7",
    marginBottom: 10,
    fontSize: 28
  },
  subHeading: {
    textAlign: "center",
    color: "#555",
    marginBottom: 40
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 25,
    maxWidth: 1200,
    margin: "0 auto"
  },
  card: {
    background: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    transition: "transform 0.3s"
  },
  image: {
    width: "100%",
    height: 180,
    objectFit: "cover"
  },
  cardBody: {
    padding: 15
  }
};

export default TouristPlaces;