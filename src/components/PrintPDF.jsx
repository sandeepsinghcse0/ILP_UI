import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./PrintPDF.css";

const PrintPDF = () => {
  const contentRef = useRef(null);

  const permitData = {
    permitNo: "ILP-250101201601863829283",
    name: "Chander Shekahr Ajad",
    dob: "27/06/1996",
    gender: "Male",
    contactNo: "91201201551",
    otpVerified: "OTP Verified",
    address: "Hariniathpur Keshavpur Sitapur, Sitapur, Uttar Pradesh, Pin:-261001",
    district: "East Siang",
    checkGate: "Khemin",
    eILPValidFrom: "05-10-2025",
    eILPValidTo: "07-10-2025",
    permitCategory: "Tourist",
    applicationType: "Single",
    dateOfIssue: "02-10-2025",
  };

  const generatePDF = async () => {
    const element = contentRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    doc.save("eILP-Permit.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={generatePDF} style={buttonStyle}>
        📥 Download PDF
      </button>

      <div ref={contentRef} style={{ marginTop: "20px", backgroundColor: "white" }}>
        {/* Header */}
        <div className="pdf-header">
          <div className="signature-badge">
            <div className="signature-title">Signature Not Verified</div>
            <div className="signature-text">
              Digitally signed by Administrator<br />
              Date: 2025.10.02 47:19 IST<br />
              Reason: Issue of Tourist eILP<br />
              Location: eILP State Nodal Office
            </div>
          </div>
          <div className="header-content">
            <h2 style={{ margin: "10px 0", color: "#2c3e50" }}>Government of Arunachal Pradesh</h2>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>Tourist eILP for Indian Nationals</p>
          </div>
        </div>

        {/* Permit Details Section */}
        <div className="section-title cyan-bg">Permit Details</div>

        <div className="permit-details-container">
          <div className="qr-section">
            <div className="qr-placeholder">
              [QR Code]
            </div>
            <p style={{ fontSize: "10px", marginTop: "8px", textAlign: "center" }}>
              Scan to verify the<br />genuinity of eILP
            </p>
          </div>

          <div className="details-section">
            <div className="detail-row">
              <span className="detail-label">e-ILP valid from</span>
              <span className="detail-value">{permitData.eILPValidFrom}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">e-ILP valid to</span>
              <span className="detail-value">{permitData.eILPValidTo}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">permit Category</span>
              <span className="detail-value">{permitData.permitCategory}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Application Type</span>
              <span className="detail-value">{permitData.applicationType}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date of Issue</span>
              <span className="detail-value">{permitData.dateOfIssue}</span>
            </div>
          </div>
        </div>

        {/* District & Check Gate */}
        <div style={{ display: "flex", marginTop: "15px" }}>
          <div className="table-section">
            <table className="info-table">
              <thead>
                <tr style={{ backgroundColor: "#00bcd4", color: "white" }}>
                  <th>District</th>
                  <th>Check Gate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{permitData.district}</td>
                  <td>{permitData.checkGate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Primary Applicant Details */}
        <div className="section-title cyan-bg" style={{ marginTop: "20px" }}>
          Primary Applicant Details
        </div>

        <div className="applicant-container">
          <div className="photo-section">
            <div className="photo-placeholder">
              [Photo]
            </div>
          </div>

          <div className="applicant-details">
            <div className="applicant-row">
              <span className="applicant-label">Permit No</span>
              <span className="applicant-value">: {permitData.permitNo}</span>
            </div>
            <div className="applicant-row">
              <span className="applicant-label">Name</span>
              <span className="applicant-value">: {permitData.name}</span>
            </div>
            <div className="applicant-row">
              <span className="applicant-label">D.O.B.</span>
              <span className="applicant-value">: {permitData.dob}</span>
            </div>
            <div className="applicant-row">
              <span className="applicant-label">Gender</span>
              <span className="applicant-value">: {permitData.gender}</span>
            </div>
            <div className="applicant-row">
              <span className="applicant-label">Self Verified<br />Contact No</span>
              <span className="applicant-value">: {permitData.contactNo}</span>
            </div>
            <div className="applicant-row">
              <span className="applicant-label">OTP Verified</span>
              <span className="applicant-value"></span>
            </div>
          </div>
        </div>

        {/* Permanent Address */}
        <div className="address-section">
          <strong>Permanent Address:</strong> {permitData.address}
        </div>

        {/* Terms & Conditions */}
        <div className="terms-section">
          <strong>Terms & Conditions:</strong>
          <ol style={{ fontSize: "10px", margin: "10px 0" }}>
            <li>This is online generated Permit and it is digitally signed.</li>
            <li>It is not a trading licence, business permit, or identity card.</li>
            <li>The original document uploaded as ID proof must be produced at the check gate.</li>
            <li>The grantee shall not visit any place or travel or attempt to travel by any route other than those indicated in the eILP.</li>
            <li>This eILP is non transferable and should be used only by the person whose name it is issued.</li>
            <li>This eILP is not renewable for extension of stay, the grantee shall obtain a fresh ILP as per the rules.</li>
            <li>The permit holder is not authorized to take photographs or film in restricted areas for photo videography in the state.</li>
            <li>This pass shall not be used beyond the expiry period.</li>
            <li>If this eILP is tampered with or suspected of being altered, the eILP holder shall be booked under appropriate law.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "12px 24px",
  backgroundColor: "#2196F3",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default PrintPDF;