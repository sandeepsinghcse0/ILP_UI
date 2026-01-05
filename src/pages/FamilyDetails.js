import { useState } from "react";

export default function FamilyForm() {
  const [members, setMembers] = useState([
    { name: "", relation: "", age: "" },
  ]);

  const handleChange = (index, e) => {
    const updated = [...members];
    updated[index][e.target.name] = e.target.value;
    setMembers(updated);
  };

  const addMember = () => {
    setMembers([...members, { name: "", relation: "", age: "" }]);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 20 }}>
      <h3>Family Members Details</h3>

      {members.map((member, index) => (
        <div key={index}>
          <input
            name="name"
            placeholder="Name"
            value={member.name}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            name="relation"
            placeholder="Relation"
            value={member.relation}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            name="age"
            placeholder="Age"
            value={member.age}
            onChange={(e) => handleChange(index, e)}
          />

          <br /><br />
        </div>
      ))}

      <button onClick={addMember}>+ Add Member</button>
    </div>
  );
}