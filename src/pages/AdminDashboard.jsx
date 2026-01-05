import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) {
      navigate("/admin-login");
    }

    const data =
      JSON.parse(localStorage.getItem("ilpApplications")) || [];

    const withStatus = data.map((item) => ({
      ...item,
      status: item.status || "CHECKED IN"
    }));

    setApplications(withStatus);
  }, []);

  const checkOut = (index) => {
    const updated = [...applications];
    updated[index].status = "CHECKED OUT";
    setApplications(updated);

    localStorage.setItem("ilpApplications", JSON.stringify(updated));
  };

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin-login");
  };

  return (
    <div style={styles.page}>
      <h2>Admin Dashboard</h2>
      <button onClick={logout} style={styles.logout}>Logout</button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((app, index) => (
            <tr key={index}>
              <td>{app.name}</td>
              <td>{app.mobile}</td>
              <td>{app.status}</td>
              <td>
                {app.status === "CHECKED IN" && (
                  <button
                    onClick={() => checkOut(index)}
                    style={styles.checkOut}
                  >
                    Check Out
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  page: {
    padding: 30
  },
  table: {
    width: "100%",
    marginTop: 20,
    borderCollapse: "collapse"
  },
  logout: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer"
  },
  checkOut: {
    background: "#198754",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer"
  }
};

export default AdminDashboard;