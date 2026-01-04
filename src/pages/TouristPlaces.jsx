import { districts } from "./mockAuth";
function TouristPlaces() {
  return (
    <div style={styles.page}>
      <h2>Tourist Places to Visit</h2>
      <div style={styles.cardsContainer}>
        {districts.map((name) => (
          <div key={name} style={styles.card}>
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
// ...existing code...
const styles = {
  page: {
    padding: 40,
    textAlign: "center"
  },
  cardsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginTop: 20
  },
  card: {
    minWidth: 160,
    padding: 16,
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
    background: "#fff"
  }
};
// ...existing code...
export default TouristPlaces;