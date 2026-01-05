import { useState, useEffect } from "react";

function ApplyILP() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    gender: "",
    citizenship: "",
    aadhaar: "",
    dob: "",
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
        email: user.email || "",
        address: user.addresses?.[0]?.line1 || "",
        state: user.addresses?.[0]?.state || "",
        district: user.addresses?.[0]?.district || "",
        pincode: user.addresses?.[0]?.pincode || ""
      }));
    }
  }, []);

  // 🔹 HANDLE MAIN FORM CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔹 HANDLE FAMILY FORM CHANGE
  const handleFamilyChange = (index, e) => {
    const updated = [...familyMembers];
    updated[index][e.target.name] = e.target.value;
    setFamilyMembers(updated);
  };

  // 🔹 ADD FAMILY MEMBER
  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { name: "", relation: "", age: "" }
    ]);
  };
  
  //(REMOVE LOGIC)
  const removeFamilyMember = (index) => {
  const updated = familyMembers.filter((_, i) => i !== index);
  setFamilyMembers(updated);
};

  // 🔹 SUBMIT FORM
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

    const applicationData = {
      ...form,
      withFamily,
      familyMembers: withFamily ? familyMembers : []
    };

    localStorage.setItem(
      "ilpApplications",
      JSON.stringify([...existing, applicationData])
    );

    setMessage("ILP Application submitted successfully!");

    setForm({
      name: "",
      mobile: "",
      email: "",
      address: "",
      gender: "",
      citizenship: "Indian",
      aadhaar: "",
      dob: "",
      state: "",
      district: "",
      pincode: ""
    });

    setWithFamily(false);
    setFamilyMembers([{ name: "", relation: "", age: "" }]);
  };

  return (
    <div style={styles.container}>
      <h2>Apply for Inner Line Permit (ILP)</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="mobile"
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="dob"
          type="date"
          placeholder="Date of Birth"
          value={form.dob}
          onChange={handleChange}
          style={styles.input}
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={handleChange}
          style={styles.textarea}
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="district"
          placeholder="District"
          value={form.district}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="citizenship"
          placeholder="Citizenship"
          value={form.citizenship}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="aadhaar"
          placeholder="Aadhaar Number"
          value={form.aadhaar}
          onChange={handleChange}
          style={styles.input}
        />

        {/* FAMILY OPTION */}
        <label style={{ display: "block", marginTop: 15 }}>
          <input
            type="checkbox"
            checked={withFamily}
            onChange={() => setWithFamily(!withFamily)}
          />{" "}
          I am travelling with my family
        </label>

        {/* FAMILY MEMBERS FORM */}
        {withFamily && (
          <div style={{ marginTop: 15, borderTop: "1px solid #ccc", paddingTop: 10 }}>
            <h4>Family Members Details</h4>

            {familyMembers.map((member, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: 10,
                  marginBottom: 10,
                  borderRadius: 4
                }}
              >
                <input
                  name="name"
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => handleFamilyChange(index, e)}
                  style={styles.input}
                />

                <input
                  name="relation"
                  placeholder="Relation"
                  value={member.relation}
                  onChange={(e) => handleFamilyChange(index, e)}
                  style={styles.input}
                />

                <input
                  name="age"
                  placeholder="Age"
                  value={member.age}
                  onChange={(e) => handleFamilyChange(index, e)}
                  style={styles.input}
                />
                {familyMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(index)}
                    style={{
                      background: "#ff4d4d",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      marginTop: 5,
                      cursor: "pointer",
                      borderRadius: 4
                    }}
                  >
                    Remove
                  </button>
                )}
                </div>
              ))}

            <button type="button" onClick={addFamilyMember}>
              + Add Another Family Member
            </button>
          </div>
        )}

        {message && <p style={styles.message}>{message}</p>}

        <button type="submit" style={styles.button}>
          Submit Application
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: "50px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 6
  },
  input: {
    width: "100%",
    padding: 8,
    margin: "8px 0"
  },
  textarea: {
    width: "100%",
    padding: 8,
    margin: "8px 0",
    minHeight: 80
  },
  button: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    cursor: "pointer"
  },
  message: {
    color: "green",
    marginTop: 10
  }
};

export default ApplyILP;