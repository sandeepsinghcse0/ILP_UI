import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/nilotpal-kalita-IpRIguCAQes-unsplash.jpg";
import img2 from "../assets/arindam-saha-nAotvDpuklM-unsplash.jpg";
import img3 from "../assets/mtsjrdl--RIHgVIKjYI-unsplash.jpg";
import img4 from "../assets/feng2055172-JgtaPIu_4Ow-unsplash.jpg";
import img5 from "../assets/gaku-suyama-vY0lEGsWOZY-unsplash.jpg";

import "../styles/review.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const getReviewFromStorage = () => {
  const lastReview = localStorage.getItem("lastReview");
  if (lastReview) {
    try {
      return JSON.parse(lastReview);
    } catch (error) {
      return null;
    }
  }

  const applications =
    JSON.parse(localStorage.getItem("ilpApplications")) || [];
  return applications.length ? applications[applications.length - 1] : null;
};

const escapePdfText = (text) =>
  String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const createPdfBlob = (review) => {
  const applicant = review?.applicant || review || {};
  const lines = [
    "Inner Line Permit Review",
    "",
    "Applicant Details",
    `Name: ${applicant.name || "-"}`,
    `Mobile: ${applicant.mobile || "-"}`,
    `Email: ${applicant.email || "-"}`,
    `Gender: ${applicant.gender || "-"}`,
    `Date of Birth: ${applicant.dob || "-"}`,
    `Aadhaar: ${applicant.aadhaar || "-"}`,
    `Citizenship: ${applicant.citizenship || "India"}`,
    `Address: ${applicant.address || "-"}`,
    `State: ${applicant.state || "-"}`,
    `District: ${applicant.district || "-"}`,
    `Pincode: ${applicant.pincode || "-"}`,
    "",
    `Family Members: ${review?.members?.length || 0}`,
  ];

  review?.members?.forEach((member, index) => {
    lines.push(`Member ${index + 1}`);
    lines.push(` Relation: ${member.relation || "-"}`);
    lines.push(` Name: ${member.name || "-"}`);
    lines.push(` Mobile: ${member.mobile || "-"}`);
    lines.push(` Email: ${member.email || "-"}`);
    lines.push(` Aadhaar: ${member.aadhar || "-"}`);
    lines.push(` Address: ${member.address || "-"}`);
    lines.push(` State: ${member.state || "-"}`);
    lines.push(` District: ${member.district || "-"}`);
    lines.push(` Pincode: ${member.pincode || "-"}`);
    lines.push("");
  });

  const content = lines
    .map(
      (line, index) =>
        `BT /F1 12 Tf 40 ${760 - index * 14} Td (${escapePdfText(line)}) Tj ET`
    )
    .join("\n");

  const header = "%PDF-1.4\n";
  const objects = [];
  const offsets = [];

  const addObject = (text) => {
    offsets.push(
      header.length + objects.reduce((sum, obj) => sum + obj.length, 0)
    );
    objects.push(`${objects.length + 1} 0 obj\n${text}\nendobj\n`);
  };

  addObject("<< /Type /Catalog /Pages 2 0 R >>");
  addObject("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObject(
    "<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>"
  );
  addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  addObject(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

  const xrefOffset =
    header.length + objects.reduce((sum, obj) => sum + obj.length, 0);

  const xrefLines = ["xref", `0 ${objects.length + 1}`, "0000000000 65535 f "];
  offsets.forEach((offset) => {
    xrefLines.push(`${String(offset).padStart(10, "0")} 00000 n `);
  });

  const xref = xrefLines.join("\n") + "\n";
  const trailer = `trailer
<< /Size ${objects.length + 1} /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF`;

  const pdfString = header + objects.join("") + xref + trailer;
  return new Blob([pdfString], { type: "application/pdf" });
};

const downloadReviewPdf = (review) => {
  const blob = createPdfBlob(review);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `ILP-Review-${Date.now()}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
};


function ReviewPage() {
  const [review, setReview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const contentRef = useRef(null);
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

  const sliderImages = [img1, img2, img3, img4, img5];

  useEffect(() => {
    setReview(getReviewFromStorage());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [sliderImages.length]);

  const onBack = () => {
    navigate(-1);
  };

  const onSave = () => {
    if (!review) return;
    localStorage.setItem("savedReview", JSON.stringify(review));
    setSaved(true);
  };

  const onPrintAndPay = async () => {
    await generatePDF();
  };

  const applicant = review?.applicant || {};

  if (!review) {
    return (
      <div className="review-shell">
        <div className="review-bg-slider">
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className={`review-bg-slide ${index === activeSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          <div className="review-bg-overlay" />
          <div className="review-bg-blur" />
          <div className="review-bg-glow review-bg-glow-1" />
          <div className="review-bg-glow review-bg-glow-2" />
        </div>

        <div className="review-card review-empty-card">
          <span className="review-label">Inner Line Permit</span>
          <h1>No submission data found</h1>
          <p className="review-hero-text">
            Please complete the ILP form first, then come back here to review
            your application.
          </p>
          <div className="review-actions">
            <button className="review-button primary" onClick={onBack}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={contentRef} className="review-shell">
      <div className="review-bg-slider">
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`review-bg-slide ${index === activeSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className="review-bg-overlay" />
        <div className="review-bg-blur" />
        <div className="review-bg-glow review-bg-glow-1" />
        <div className="review-bg-glow review-bg-glow-2" />
      </div>

      <div className="review-card">
        <div className="review-topbar">
          <div>
            <span className="review-label">Inner Line Permit</span>
            <h1>Review submitted data</h1>
            <p className="review-hero-text">
              Verify all application details before saving, printing, or moving
              ahead with your process.
            </p>
          </div>

          <div className="review-topbar-side">
            <div className="status-tag">Ready to review</div>
            <div className="review-slider-dots">
              {sliderImages.map((_, index) => (
                <span
                  key={index}
                  className={`review-dot ${index === activeSlide ? "active" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="review-grid">
          <section className="review-panel">
            <h2>Applicant Details</h2>
            <ul className="review-list">
              <li>
                <span>Full Name</span>
                <strong>{applicant.name || "-"}</strong>
              </li>
              <li>
                <span>Mobile</span>
                <strong>{applicant.mobile || "-"}</strong>
              </li>
              <li>
                <span>Email</span>
                <strong>{applicant.email || "-"}</strong>
              </li>
              <li>
                <span>Gender</span>
                <strong>{applicant.gender || "-"}</strong>
              </li>
              <li>
                <span>Date of Birth</span>
                <strong>{applicant.dob || "-"}</strong>
              </li>
              <li>
                <span>Aadhaar</span>
                <strong>{applicant.aadhaar || "-"}</strong>
              </li>
              <li>
                <span>Citizenship</span>
                <strong>{applicant.citizenship || "India"}</strong>
              </li>
              <li>
                <span>Address</span>
                <strong>{applicant.address || "-"}</strong>
              </li>
              <li>
                <span>State</span>
                <strong>{applicant.state || "-"}</strong>
              </li>
              <li>
                <span>District</span>
                <strong>{applicant.district || "-"}</strong>
              </li>
              <li>
                <span>Pincode</span>
                <strong>{applicant.pincode || "-"}</strong>
              </li>
            </ul>
          </section>

          <section className="review-panel">
            <h2>Family Members</h2>

            {review?.members?.length ? (
              <div className="review-members">
                {review.members.map((member, index) => (
                  <div className="member-card" key={index}>
                    <div className="member-card-top">
                      <div className="member-chip">Member {index + 1}</div>
                      <div className="member-heading">
                        {member.name || "Unnamed member"}
                      </div>
                    </div>

                    <div className="member-detail">
                      <strong>Relation:</strong> {member.relation || "-"}
                    </div>
                    <div className="member-detail">
                      <strong>Mobile:</strong> {member.mobile || "-"}
                    </div>
                    <div className="member-detail">
                      <strong>Email:</strong> {member.email || "-"}
                    </div>
                    <div className="member-detail">
                      <strong>Aadhaar:</strong> {member.aadhar || "-"}
                    </div>
                    <div className="member-detail">
                      <strong>Address:</strong> {member.address || "-"}
                    </div>
                    <div className="member-detail">
                      <strong>State:</strong> {member.state || "-"}
                    </div>
                    <div className="member-detail">
                      <strong>District:</strong> {member.district || "-"}
                    </div>
                    <div className="member-detail">
                      <strong>Pincode:</strong> {member.pincode || "-"}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="review-note">No members were added.</p>
            )}
          </section>
        </div>

        <div className="review-actions">
          <button className="review-button secondary" onClick={onBack}>
            Back
          </button>
          <button className="review-button save" onClick={onSave}>
            Save Review
          </button>
          <button className="review-button primary" onClick={onPrintAndPay}>
            Print / Download PDF
          </button>
        </div>

        {saved && <p className="review-saved">Application saved locally.</p>}
      </div>
    </div>
  );
}

export default ReviewPage;