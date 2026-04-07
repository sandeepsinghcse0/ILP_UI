import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/form.css";
import { statesDistricts } from "./data/statedistricts";
import ReCAPTCHA from "react-google-recaptcha";

const Form = () => {
  const [step, setStep] = useState(1);
  const [aadhaar, setAadhaar] = useState("");
  const [purpose, setPurpose] = useState("");
  const [visitFrom, setVisitFrom] = useState("");
  const [visitTo, setVisitTo] = useState("");
  const [vehicleTravel, setVehicleTravel] = useState("N/A");
  const [vehicleNumber, setVehicleNumber] = useState("");
  

  const purposeOptions = [
    "Tourism",
    "Business",
    "Education",
    "Employment",
    "Medical Treatment",
    "Visiting Family or Friends",
    "Government Work",
    "Religious Visit",
    "Conference / Seminar",
    "Research",
    "Cultural Event",
    "Transit",
    "Adventure / Trekking",
    "Photography / Media Work",
    "Other",
  ];

  const emptyMember = {
    relation: "",
    name: "",
    mobile: "",
    email: "",
    gender: "",
    dob: "",
    aadhaar: "",
    citizenship: "India",
    address: "",
    state: "",
    district: "",
    pincode: "",
    photoDataUrl: "",
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
  }, []);

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

  const handleMainPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      alert("Please upload an image file");
      e.target.value = "";
      return;
    }

    // keep localStorage payload reasonable
    const maxBytes = 1024 * 1024; // 1MB
    if (file.size > maxBytes) {
      alert("Image too large. Please upload an image under 1MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setMainForm((prev) => ({
        ...prev,
        photoDataUrl: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.onerror = () => {
      alert("Failed to read image. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  // MEMBER CHANGE
  const handleMemberChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && !/^[a-zA-Z\s]*$/.test(value)) return;
    if (name === "mobile" && !/^[0-9]{0,10}$/.test(value)) return;
    if (name === "pincode" && !/^[0-9]{0,6}$/.test(value)) return;
    if (name === "aadhaar" && !/^[0-9]{0,12}$/.test(value)) return;

    setCurrentMember({
      ...currentMember,
      [name]: value,
    });
  };

  // STEP 2 SUBMIT
  const goToMembers = (e) => {
    e.preventDefault();

    if (visitFrom && visitTo && visitTo < visitFrom) {
      alert("Visit To date cannot be earlier than Visit From date");
      return;
    }

    if (vehicleTravel === "Yes") {
      const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
      
      if (!vehicleRegex.test(vehicleNumber)) {
        alert("Enter valid vehicle number (Example: UP65AB1234)");
        return;
      }
    }

    if (!purpose) {
      alert("Please select a purpose of visit");
      return;
    }

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

    if (!/^[0-9]{12}$/.test(currentMember.aadhaar)) {
      alert("Member Aadhaar must be 12 digits");
      return;
    }

    if (members.length >= 4) {
      alert("Maximum 5 members allowed");
      return;
    }

    setMembers((prev) => [...prev, currentMember]);
    setCurrentMember(emptyMember);
  };

  // FINAL SUBMIT
  const handleFinalSubmit = () => {
   
    const data = {
      applicant: { ...mainForm, aadhaar, purpose, visitFrom, visitTo, vehicleTravel, vehicleNumber },
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

          <label className="lable">Name</label>
          <input name="name" placeholder="Name" value={mainForm.name} onChange={handleMainChange} />
          <label className="lable">Mobile</label>
          <input name="mobile" placeholder="Mobile" value={mainForm.mobile} onChange={handleMainChange} />
          <label className="lable">Email</label>
          <input name="email" placeholder="Email" value={mainForm.email} onChange={handleMainChange} />

          <label className="lable">Gender</label>
          <select name="gender" value={mainForm.gender} onChange={handleMainChange}>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <label className="lable">Date of Birth</label>
          <input type="date" name="dob" value={mainForm.dob} onChange={handleMainChange} />

          <label className="lable">Nationality</label>
          <input value="India" readOnly />
          <label className="lable">Aadhaar Number</label>
          <input value={aadhaar} readOnly />

          <label className="lable">Upload Photo</label>
          <input type="file" accept="image/*" onChange={handleMainPhotoChange} />
          {mainForm.photoDataUrl ? (
            <div style={{ marginTop: 8 }}>
              <img
                src={mainForm.photoDataUrl}
                alt="Applicant preview"
                style={{ width: 110, height: 130, objectFit: "cover", border: "1px solid #bbb" }}
              />
            </div>
          ) : null}

          <label className="lable">Address</label>
          <textarea name="address" placeholder="Address" value={mainForm.address} onChange={handleMainChange} />

          
          <label className="lable">State</label>
          <select name="state" value={mainForm.state} onChange={handleMainChange}>
            <option value="">Select State</option>
            {Object.keys(statesDistricts).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          
          <label className="lable">District</label>
          <select name="district" value={mainForm.district} onChange={handleMainChange}>
            <option value="">Select District</option>
            {statesDistricts[mainForm.state]?.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          {/* Purpose of Visit */}
           <select
             value={purpose}
             onChange={(e) => setPurpose(e.target.value)}
          >
            <option value="">Purpose of Visit</option>
            {purposeOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {/* Visit Section */}
          <label className="lable">Visit Dates</label>

          {/* <div className="visit-section"> */}

            <label className="lable1">From</label>
            <input
            type="date"
            value={visitFrom}
            onChange={(e) => setVisitFrom(e.target.value)}
            />
            
            <label className="lable1">To</label>
            <input
            type="date"
            value={visitTo}
            onChange={(e) => setVisitTo(e.target.value)}
            />
            
            {/* </div> */}

          <label className="lable">Pincode</label>
          <input name="pincode" placeholder="Pincode" value={mainForm.pincode} onChange={handleMainChange} />

          {/* Vehicle Section */}
         <label className="lable">Are you travelling with vehicle?</label>
         <select
           value={vehicleTravel}
           onChange={(e) => setVehicleTravel(e.target.value)}
              >
           <option value="N/A">Are you travelling with vehicle</option>
           <option value="Yes">Yes</option>
           <option value="N/A">N/A</option>
           </select>

          {vehicleTravel === "Yes" && (
            <input
           type="text"
           placeholder="Enter Vehicle Number"
             value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
              />
                 )}



          <button type="submit">Add Members</button>


          <button type="button" onClick={handleFinalSubmit}>Submit</button>
        </form>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="formBox">

          <h2>Add Member ({members.length + 1}/5)</h2>

          <label className="lable">Relation</label>
          <select name="relation" value={currentMember.relation} onChange={handleMemberChange}>
            <option value="">Select Relation</option>
            <option>Father</option>
            <option>Mother</option>
            <option>Child</option>
            <option>Brother</option>
            <option>Sister</option>
            <option>Other</option>
          </select>

          <label className="lable">Name</label>
          <input name="name" placeholder="Name" value={currentMember.name} onChange={handleMemberChange} />
          <label className="lable">Mobile</label>
          <input name="mobile" placeholder="Mobile" value={currentMember.mobile} onChange={handleMemberChange} />
          <label className="lable">Email</label>
          <input name="email" placeholder="Email" value={currentMember.email} onChange={handleMemberChange} />

          <label className="lable">Gender</label>
          <select name="gender" value={currentMember.gender} onChange={handleMemberChange}>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <label className="lable">Date of Birth</label>
          <input type="date" name="dob" value={currentMember.dob} onChange={handleMemberChange} />

          
          <label className="lable">Nationality</label>
          <input value="India" readOnly />

          
          <label className="lable">Aadhaar</label>
          <input
            name="aadhaar"
            placeholder="Member Aadhaar"
            value={currentMember.aadhaar}
            onChange={handleMemberChange}
            maxLength="12"
          />

         
          <label className="lable">Address</label>
          <textarea name="address" placeholder="Address" value={currentMember.address} onChange={handleMemberChange} />

          
          <label className="lable">State</label>
          <select name="state" value={currentMember.state} onChange={handleMemberChange}>
            <option value="">Select State</option>
            {Object.keys(statesDistricts).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          
          <label className="lable">District</label>
          <select name="district" value={currentMember.district} onChange={handleMemberChange}>
            <option value="">Select District</option>
            {statesDistricts[currentMember.state]?.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <label className="lable">Pincode</label>
          <input name="pincode" placeholder="Pincode" value={currentMember.pincode} onChange={handleMemberChange} />

          <button type="button" onClick={addMember}>Add Member</button>

          <h3>Members:</h3>
          <ul>
            <li>{mainForm.name} | Main Applicant | {mainForm.mobile} | {aadhaar}</li>
            {members.map((m, i) => (
              <li key={i}>
                {m.name} | {m.relation} | {m.mobile} | {m.aadhaar}
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