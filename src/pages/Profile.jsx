import { Navigate } from "react-router-dom";

function Profile() {
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("registeredUser"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  // 🔹 Get all ILP applications
  const allApplications =
    JSON.parse(localStorage.getItem("ilpApplications")) || [];

  // 🔹 Filter applications for this user
  const myApplications = allApplications.filter(
    (app) =>
      app.email === user.email || app.mobile === user.mobile
  );

  return (
    <div style={styles.container}>
      <h2>User Profile</h2>

      {/* USER DETAILS */}
      <div style={styles.card}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Mobile:</strong> {user.mobile}</p>
      </div>

      {/* ADDRESSES */}
      <h3>Addresses</h3>
      {(user.addresses && user.addresses.length > 0) ? (
        user.addresses.map((addr, index) => (
          <div key={index} style={styles.address}>
            <p>{addr.line1}</p>
            <p>{addr.city}, {addr.state}</p>
            <p>Pincode: {addr.pincode}</p>
          </div>
        ))
      ) : (
        <p>No address added.</p>
      )}

      {/* ILP APPLICATIONS */}
      <h3>My ILP Applications</h3>

      {myApplications.length === 0 ? (
        <p>No ILP applications submitted yet.</p>
      ) : (
        myApplications.map((app, index) => (
          <div key={index} style={styles.ilpCard}>
            <p><strong>Name:</strong> {app.name}</p>
            <p><strong>Mobile:</strong> {app.mobile}</p>
            <p><strong>Email:</strong> {app.email}</p>
            <p><strong>Gender:</strong> {app.gender}</p>
            <p><strong>Citizenship:</strong> {app.citizenship}</p>
            <p><strong>Aadhaar:</strong> {app.aadhaar}</p>
            <p><strong>Address:</strong> {app.address}</p>
            <p><strong>Status:</strong> <span style={styles.status}>Submitted</span></p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: "40px auto",
    padding: 20
  },
  card: {
    border: "1px solid #ccc",
    padding: 20,
    borderRadius: 6,
    marginBottom: 20
  },
  address: {
    border: "1px dashed #aaa",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10
  },
  ilpCard: {
    border: "1px solid #0b5ed7",
    padding: 15,
    borderRadius: 6,
    marginBottom: 15,
    backgroundColor: "#f8f9fa"
  },
  status: {
    color: "green",
    fontWeight: "bold"
  }
};

export default Profile;
