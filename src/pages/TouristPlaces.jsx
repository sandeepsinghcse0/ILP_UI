function TouristPlaces() {
  return (
    <div style={styles.page}>
      <h2>Tourist Places to Visit</h2>
      <ul>
        <li>Tawang</li>
        <li>Ziro Valley</li>
        <li>Bomdila</li>
        <li>Dirang</li>
      </ul>
    </div>
  );
}

const styles = {
  page: {
    padding: 40,
    textAlign: "center"
  }
};

export default TouristPlaces;
