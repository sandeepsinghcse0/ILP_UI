import { useState, useEffect } from "react";

function ApplyILP() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    gender: "",
    dob: "",
    citizenship: "Indian",
    aadhaar: "",
    address: "",
    state: "",
    district: "",
    pincode: ""
  });

  const [message, setMessage] = useState("");
  const [withFamily, setWithFamily] = useState(false);

  const [familyMembers, setFamilyMembers] = useState([
    { name: "", relation: "", age: "" }
  ]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        mobile: user.mobile || "",
        email: user.email || ""
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFamilyChange = (index, e) => {
    const updated = [...familyMembers];
    updated[index][e.target.name] = e.target.value;
    setFamilyMembers(updated);
  };

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: "", relation: "", age: "" }]);
  };

  const removeFamilyMember = (index) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (let key in form) {
      if (!form[key]) {
        setMessage("All fields are required");
        return;
      }
    }

    if (withFamily) {
      for (let member of familyMembers) {
        if (!member.name || !member.relation || !member.age) {
          setMessage("Please fill all family member details");
          return;
        }
      }
    }

    const existing =
      JSON.parse(localStorage.getItem("ilpApplications")) || [];

    localStorage.setItem(
      "ilpApplications",
      JSON.stringify([
        ...existing,
        { ...form, withFamily, familyMembers }
      ])
    );

    setMessage("ILP Application submitted successfully!");

    setForm({
      name: "",
      mobile: "",
      email: "",
      gender: "",
      dob: "",
      citizenship: "Indian",
      aadhaar: "",
      address: "",
      state: "",
      district: "",
      pincode: ""
    });

    setWithFamily(false);
    setFamilyMembers([{ name: "", relation: "", age: "" }]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Apply for Inner Line Permit (ILP)</h2>

        <form onSubmit={handleSubmit}>
          {/* PERSONAL DETAILS */}
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} style={styles.input} />
          <input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} style={styles.input} />
          <input name="email" placeholder="Email Address" value={form.email} onChange={handleChange} style={styles.input} />

          <select name="gender" value={form.gender} onChange={handleChange} style={styles.input}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input type="date" name="dob" value={form.dob} onChange={handleChange} style={styles.input} />
          <input name="aadhaar" placeholder="Aadhaar Number" value={form.aadhaar} onChange={handleChange} style={styles.input} />
          <input name="citizenship" value={form.citizenship} readOnly style={styles.input} />

          {/* ADDRESS */}
          <textarea name="address" placeholder="Full Address" value={form.address} onChange={handleChange} style={styles.textarea} />
          <input name="state" placeholder="State" value={form.state} onChange={handleChange} style={styles.input} />
          <input name="district" placeholder="District" value={form.district} onChange={handleChange} style={styles.input} />
          <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} style={styles.input} />

          {/* FAMILY */}
          <label style={{ display: "block", marginTop: 15 }}>
            <input type="checkbox" checked={withFamily} onChange={() => setWithFamily(!withFamily)} /> Travelling with family
          </label>

          {withFamily && (
            <div>
              {familyMembers.map((member, index) => (
                <div key={index} style={styles.familyBox}>
                  <input name="name" placeholder="Name" value={member.name} onChange={(e) => handleFamilyChange(index, e)} style={styles.input} />
                  <input name="relation" placeholder="Relation" value={member.relation} onChange={(e) => handleFamilyChange(index, e)} style={styles.input} />
                  <input name="age" placeholder="Age" value={member.age} onChange={(e) => handleFamilyChange(index, e)} style={styles.input} />

                  {familyMembers.length > 1 && (
                    <button type="button" onClick={() => removeFamilyMember(index)} style={styles.removeBtn}>
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button type="button" onClick={addFamilyMember} style={styles.addBtn}>
                + Add Family Member
              </button>
            </div>
          )}

          {message && <p style={styles.message}>{message}</p>}

          <button type="submit" style={styles.button}>
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f4f6f9",
    minHeight: "100vh",
    padding: "40px 0"
  },
  card: {
    maxWidth: 720,
    margin: "auto",
    background: "#fff",
    padding: 30,
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },
  heading: {
    borderBottom: "2px solid #0b5ed7",
    paddingBottom: 8,
    marginBottom: 20,
    color: "#0b5ed7"
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "8px 0",
    borderRadius: 4,
    border: "1px solid #ccc"
  },
  textarea: {
    width: "100%",
    padding: 10,
    margin: "8px 0",
    borderRadius: 4,
    border: "1px solid #ccc",
    minHeight: 80
  },
  familyBox: {
    border: "1px solid #ddd",
    padding: 15,
    borderRadius: 6,
    marginBottom: 12,
    background: "#fafafa"
  },
  button: {
    width: "100%",
    padding: 12,
    marginTop: 20,
    background: "#0b5ed7",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    fontSize: 16,
    cursor: "pointer"
  },
  addBtn: {
    marginTop: 10,
    background: "#198754",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer"
  },
  removeBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    marginTop: 5,
    borderRadius: 4,
    cursor: "pointer"
  },
  message: {
    marginTop: 15,
    color: "green",
    fontWeight: 500
  }
};

export default ApplyILP;