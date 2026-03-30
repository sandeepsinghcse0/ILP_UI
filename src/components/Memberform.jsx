import React, { useState } from "react";
import { statesDistricts } from "../data/statesDistricts";

const emptyMember = {
relation:"",
name:"",
mobile:"",
email:"",
gender:"",
dob:"",
aadhar:"",
citizenship:"India",
address:"",
state:"",
district:"",
pincode:""
};

const MemberForm = ({ applicant, aadhaar }) => {
  const [members, setMembers] = useState([]);
  const [member, setMember] = useState(emptyMember);

  const handleChange = (e) => {
    setMember({
      ...member,
      [e.target.name]: e.target.value
    });
  };

  const addMember = () => {
    if (members.length >= 5) {
      alert("Maximum 5 members allowed");
      return;
    }

    if (!member.name || !member.mobile || !member.email || !member.relation) {
      alert("Please fill relation, name, mobile and email for member");
      return;
    }

    setMembers([...members, member]);
    setMember(emptyMember);
  };

  const handleSubmit = () => {
    const finalData = {
      applicant,
      aadhaar,
      members
    };

    localStorage.setItem("ilpApplications", JSON.stringify(finalData));
    console.log(finalData);

    alert("Form Submitted Successfully");

    setMember(emptyMember);
    setMembers([]);
  };

  return (
    <div className="formBox">
      <h2>Add Member ({members.length}/5)</h2>

      <select name="relation" value={member.relation} onChange={handleChange}>
        <option value="">Select Relation</option>
        <option>Father</option>
        <option>Mother</option>
        <option>Child</option>
        <option>Brother</option>
        <option>Sister</option>
        <option>Other</option>
      </select>

      <input name="name" placeholder="Name" value={member.name} onChange={handleChange} />
      <input name="mobile" placeholder="Mobile" value={member.mobile} onChange={handleChange} />
      <input name="email" placeholder="Email" value={member.email} onChange={handleChange} />

      <select name="gender" value={member.gender} onChange={handleChange}>
        <option value="">Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <input type="date" name="dob" value={member.dob} onChange={handleChange} />
      <input value="India" readOnly />
      <input value={aadhaar || ""} readOnly />

      <textarea name="address" placeholder="Address" value={member.address} onChange={handleChange} />

      <select name="state" value={member.state} onChange={handleChange}>
        <option value="">Select State</option>
        {Object.keys(statesDistricts).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select name="district" value={member.district} onChange={handleChange}>
        <option value="">Select District</option>
        {statesDistricts[member.state]?.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <input name="pincode" placeholder="Pincode" value={member.pincode} onChange={handleChange} />

      <button type="button" onClick={addMember} style={{ marginRight: 8 }}>
        Add Member
      </button>

      <button type="button" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default MemberForm;

