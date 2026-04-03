import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./PrintPDF.css";

const PrintPDF = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const review =
    location.state ||
    JSON.parse(localStorage.getItem("savedReview")) ||
    JSON.parse(localStorage.getItem("lastReview")) ||
    null;

  const generatePDF = (reviewData) => {
    if (!reviewData) return;

    const applicant = reviewData?.applicant || {};
    const members = reviewData?.members || [];

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(18);
    doc.text("Inner Line Permit Review", 40, 40);

    const applicantBody = [
      ["Full Name", applicant.name || "-"],
      ["Mobile", applicant.mobile || "-"],
      ["Email", applicant.email || "-"],
      ["Gender", applicant.gender || "-"],
      ["Date of Birth", applicant.dob || "-"],
      ["Aadhaar", applicant.aadhaar || "-"],
      ["Citizenship", applicant.citizenship || "-"],
      ["Address", applicant.address || "-"],
      ["State", applicant.state || "-"],
      ["District", applicant.district || "-"],
      ["Pincode", applicant.pincode || "-"],
    ];

    doc.autoTable({
      startY: 70,
      head: [["Field", "Value"]],
      body: applicantBody,
      theme: "grid",
      headStyles: { fillColor: "#00bcd4", textColor: "#fff" },
      styles: { fontSize: 10 },
    });

    let currentY = doc.lastAutoTable.finalY + 20;

    if (members.length) {
      doc.setFontSize(14);
      doc.text("Family Members", 40, currentY);
      currentY += 18;

      const membersBody = members.map((member, idx) => [
        idx + 1,
        member.relation || "-",
        member.name || "-",
        member.mobile || "-",
        member.email || "-",
        member.aadhar || "-",
        member.address || "-",
        member.state || "-",
        member.district || "-",
        member.pincode || "-",
      ]);

      doc.autoTable({
        startY: currentY,
        head: [["#", "Relation", "Name", "Mobile", "Email", "Aadhaar", "Address", "State", "District", "Pincode"]],
        body: membersBody,
        theme: "striped",
        headStyles: { fillColor: "#1976d2", textColor: "#fff" },
        styles: { fontSize: 8 },
      });
    }

    doc.save(`ILP-Review-${Date.now()}.pdf`);
  };

  useEffect(() => {
    if (review) {
      generatePDF(review);
    }
  }, [review]);

  if (!review) {
    return (
      <div className="print-pdf-page" style={{ padding: "20px" }}>
        <h2>No review data available for PDF generation</h2>
        <button onClick={() => navigate(-1)} style={{ marginTop: "12px", padding: "10px 16px" }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="print-pdf-page" style={{ padding: "20px" }}>
      <h2>PDF generated for Review</h2>
      <p>If it did not download automatically, click below.</p>
      <button
        onClick={() => generatePDF(review)}
        style={{ padding: "12px 24px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
      >
        📥 Download PDF Again
      </button>

      <button
        onClick={() => navigate(-1)}
        style={{ marginLeft: "10px", padding: "12px 24px", backgroundColor: "#757575", color: "white", border: "none", borderRadius: "4px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
      >
        Back to Review
      </button>
    </div>
  );
};

export default PrintPDF;