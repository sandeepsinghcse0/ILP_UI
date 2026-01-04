function Home() {
  return (
    <div style={styles.page}>
      <h2>Welcome to Government of Arunachal Pradesh</h2>

      {/* GALLERY */}
      <section style={styles.section}>
        <h3>Photo Gallery</h3>

        <div style={styles.gallery}>
          <img src="https://via.placeholder.com/200" alt="gallery1" />
          <img src="https://via.placeholder.com/200" alt="gallery2" />
          <img src="https://via.placeholder.com/200" alt="gallery3" />
          <img src="https://via.placeholder.com/200" alt="gallery4" />
        </div>
      </section>

      {/* NEWS */}
      <section style={styles.section}>
        <h3>Latest News</h3>

        <ul style={styles.newsList}>
          <li>📢 ILP online application system launched</li>
          <li>📢 Tourism festival announced for 2026</li>
          <li>📢 New digital services portal inaugurated</li>
          <li>📢 Road connectivity projects approved</li>
        </ul>
      </section>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    textAlign: "center"
  },
  section: {
    marginTop: "40px"
  },
  gallery: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap"
  },
  newsList: {
    listStyle: "none",
    padding: 0,
    maxWidth: "500px",
    margin: "0 auto",
    textAlign: "left"
  }
};

export default Home;
