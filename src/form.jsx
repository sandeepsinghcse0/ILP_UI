import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/form.css";

const statesDistricts = {
  "Uttar Pradesh": ["Lucknow", "Ghaziabad", "Kanpur"],
  Delhi: ["New Delhi", "North Delhi"],
  Bihar: ["Patna", "Gaya"],
};

const Form = () => {
  const [step, setStep] = useState(1);
  const [aadhaar, setAadhaar] = useState("");

  const emptyMember = {
    relation: "",
    name: "",
    mobile: "",
    email: "",
    gender: "",
    dob: "",
    aadhar: "",
    citizenship: "India",
    address: "",
    state: "",
    district: "",
    pincode: "",
  };

  const [mainForm, setMainForm] = useState(emptyMember);
  const [members, setMembers] = useState([]);
  const [currentMember, setCurrentMember] = useState(emptyMember);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      setMainForm((prev) => ({
        ...prev,
        name: user.name || "",
        mobile: user.mobile || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    setMainForm((prev) => ({ ...prev, district: "" }));
  }, [mainForm.state]);

  useEffect(() => {
    setCurrentMember((prev) => ({ ...prev, district: "" }));
  }, [currentMember.state]);

  // STEP 1 Aadhaar
  const handleAadhaarSubmit = (e) => {
    e.preventDefault();

    if (!/^[0-9]{12}$/.test(aadhaar)) {
      alert("Aadhaar must be 12 digits");
      return;
    }

    setStep(2);
  };

  // MAIN FORM CHANGE
  const handleMainChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && !/^[a-zA-Z\s]*$/.test(value)) return;
    if (name === "mobile" && !/^[0-9]{0,10}$/.test(value)) return;
    if (name === "pincode" && !/^[0-9]{0,6}$/.test(value)) return;

    setMainForm({
      ...mainForm,
      [name]: value,
    });
  };

  // MEMBER CHANGE
  const handleMemberChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && !/^[a-zA-Z\s]*$/.test(value)) return;
    if (name === "mobile" && !/^[0-9]{0,10}$/.test(value)) return;
    if (name === "pincode" && !/^[0-9]{0,6}$/.test(value)) return;
    if (name === "aadhar" && !/^[0-9]{0,12}$/.test(value)) return;

    setCurrentMember({
      ...currentMember,
      [name]: value,
    });
  };

  // STEP 2 SUBMIT
  const goToMembers = (e) => {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(mainForm.email)) {
      alert("Enter valid email");
      return;
    }

    if (!/^[0-9]{10}$/.test(mainForm.mobile)) {
      alert("Mobile must be 10 digits");
      return;
    }

    if (!/^[0-9]{6}$/.test(mainForm.pincode)) {
      alert("Pincode must be 6 digits");
      return;
    }

    setStep(3);
  };

  // ADD MEMBER
  const addMember = () => {
    if (!currentMember.name || !currentMember.mobile) {
      alert("Please fill Name and Mobile");
      return;
    }

    if (!/^[0-9]{10}$/.test(currentMember.mobile)) {
      alert("Mobile must be 10 digits");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(currentMember.email)) {
      alert("Enter valid email");
      return;
    }

    if (!/^[0-9]{6}$/.test(currentMember.pincode)) {
      alert("Pincode must be 6 digits");
      return;
    }

    if (!/^[0-9]{12}$/.test(currentMember.aadhar)) {
      alert("Member Aadhaar must be 12 digits");
      return;
    }

    if (members.length >= 5) {
      alert("Maximum 5 members allowed");
      return;
    }

    setMembers((prev) => [...prev, currentMember]);
    setCurrentMember(emptyMember);
  };

  // FINAL SUBMIT
  const handleFinalSubmit = () => {
    const data = {
      applicant: { ...mainForm, aadhaar },
      members,
    };

    const existing =
      JSON.parse(localStorage.getItem("ilpApplications")) || [];

    localStorage.setItem(
      "ilpApplications",
      JSON.stringify([...existing, data])
    );
    localStorage.setItem("lastReview", JSON.stringify(data));

    alert("Form Submitted Successfully");
    navigate("/review");

    setMainForm(emptyMember);
    setMembers([]);
    setCurrentMember(emptyMember);
    setAadhaar("");
    setStep(1);
  };

  return (
    <div className="container">

      {/* STEP 1 */}
      {step === 1 && (
        <form className="formBox" onSubmit={handleAadhaarSubmit}>
          <h2>Enter Aadhaar Number</h2>

          <input
            type="text"
            maxLength="12"
            placeholder="Enter 12 digit Aadhaar"
            value={aadhaar}
            onChange={(e) => {
              const value = e.target.value;
              if (!/^[0-9]{0,12}$/.test(value)) return;
              setAadhaar(value);
            }}
          />

          <button type="submit">Continue</button>
        </form>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <form className="formBox" onSubmit={goToMembers}>
          <h2>Main Applicant</h2>

          <input name="name" placeholder="Name" value={mainForm.name} onChange={handleMainChange} />
          <input name="mobile" placeholder="Mobile" value={mainForm.mobile} onChange={handleMainChange} />
          <input name="email" placeholder="Email" value={mainForm.email} onChange={handleMainChange} />

          <select name="gender" value={mainForm.gender} onChange={handleMainChange}>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input type="date" name="dob" value={mainForm.dob} onChange={handleMainChange} />

          <input value="India" readOnly />
          <input value={aadhaar} readOnly />

          <textarea name="address" placeholder="Address" value={mainForm.address} onChange={handleMainChange} />

          <select name="state" value={mainForm.state} onChange={handleMainChange}>
            <option value="">Select State</option>
            {Object.keys(statesDistricts).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select name="district" value={mainForm.district} onChange={handleMainChange}>
            <option value="">Select District</option>
            {statesDistricts[mainForm.state]?.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <input name="pincode" placeholder="Pincode" value={mainForm.pincode} onChange={handleMainChange} />

          <button type="submit">Add Members</button>
          <button type="button" onClick={handleFinalSubmit}>Submit</button>
        </form>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="formBox">

          <h2>Add Member ({members.length}/5)</h2>

          <select name="relation" value={currentMember.relation} onChange={handleMemberChange}>
            <option value="">Select Relation</option>
            <option>Father</option>
            <option>Mother</option>
            <option>Child</option>
            <option>Brother</option>
            <option>Sister</option>
            <option>Other</option>
          </select>

          <input name="name" placeholder="Name" value={currentMember.name} onChange={handleMemberChange} />
          <input name="mobile" placeholder="Mobile" value={currentMember.mobile} onChange={handleMemberChange} />
          <input name="email" placeholder="Email" value={currentMember.email} onChange={handleMemberChange} />

          <select name="gender" value={currentMember.gender} onChange={handleMemberChange}>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input type="date" name="dob" value={currentMember.dob} onChange={handleMemberChange} />

          <input value="India" readOnly />

          <input
            name="aadhar"
            placeholder="Member Aadhaar"
            value={currentMember.aadhar}
            onChange={handleMemberChange}
            maxLength="12"
          />

          <textarea name="address" placeholder="Address" value={currentMember.address} onChange={handleMemberChange} />

          <select name="state" value={currentMember.state} onChange={handleMemberChange}>
            <option value="">Select State</option>
            {Object.keys(statesDistricts).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select name="district" value={currentMember.district} onChange={handleMemberChange}>
            <option value="">Select District</option>
            {statesDistricts[currentMember.state]?.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <input name="pincode" placeholder="Pincode" value={currentMember.pincode} onChange={handleMemberChange} />

          <button type="button" onClick={addMember}>Add Member</button>

          <h3>Added Members:</h3>
          <ul>
            {members.map((m, i) => (
              <li key={i}>
                {m.name} | {m.relation} | {m.mobile} | {m.aadhar}
              </li>
            ))}
          </ul>

          <button onClick={handleFinalSubmit}>Submit</button>

        </div>
      )}
    </div>
  );
};

export default Form;