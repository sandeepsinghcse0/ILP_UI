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

// ─── helpers ────────────────────────────────────────────────────────────────

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
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

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

// ─── eILP No generator (deterministic from aadhaar or random) ───────────────
const generateEilpNo = (aadhaar) => {
  if (aadhaar && aadhaar.length >= 8) {
    return `0${aadhaar.slice(0, 3)}${aadhaar.slice(3, 7)}${aadhaar.slice(7, 11)}${aadhaar.slice(-1)}203`;
  }
  return `0211245660409203`;
};

// ─── Barcode SVG (rendered as CSS stripes) ───────────────────────────────────
const BarcodeStripes = ({ value = "", width = 180, height = 40 }) => {
  const seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const bars = [];
  let x = 0;
  const totalBars = 60;
  for (let i = 0; i < totalBars; i++) {
    const w = ((((seed * (i + 7) * 31) % 17) + 1) / 17) * (width / totalBars) * 1.4;
    const isBlack = (seed + i * 13) % 3 !== 0;
    if (isBlack) bars.push({ x: Math.floor(x), w: Math.max(1, Math.floor(w)) });
    x += w;
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} fill="#000" />
      ))}
    </svg>
  );
};

// ─── QR Code placeholder (checkerboard pattern) ──────────────────────────────
const QRPlaceholder = ({ size = 70 }) => {
  const cells = 10;
  const cell = size / cells;
  const seed = 8347;
  const rects = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      if ((seed * (r + 1) * (c + 3)) % 2 === 0) {
        rects.push(
          <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#000" />
        );
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ border: "2px solid #000" }}>
      <rect width={size} height={size} fill="#fff" />
      {rects}
    </svg>
  );
};

// ─── Photo placeholder ───────────────────────────────────────────────────────
const PhotoPlaceholder = ({ name = "", size = 80 }) => (
  <div style={{
    width: size, height: size + 10,
    border: "1.5px solid #888",
    background: "#e8e8e8",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    fontSize: 9, color: "#555", textAlign: "center"
  }}>
    <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 40 40" fill="#aaa">
      <circle cx="20" cy="14" r="9" />
      <ellipse cx="20" cy="34" rx="15" ry="10" />
    </svg>
    <span style={{ fontSize: 8, marginTop: 2 }}>{name.split(" ")[0] || "Photo"}</span>
  </div>
);

// ─── Arunachal Pradesh SVG Logo (recreated from emblem shape) ────────────────
const APLogo = ({ size = 72 }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 120 90">
    {/* Sun rays */}
    {[...Array(12)].map((_, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x1 = 60 + 18 * Math.cos(angle);
      const y1 = 38 + 18 * Math.sin(angle);
      const x2 = 60 + 28 * Math.cos(angle);
      const y2 = 38 + 28 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e87722" strokeWidth="2" />;
    })}
    {/* Sun circle */}
    <circle cx="60" cy="38" r="14" fill="#e87722" />
    {/* Mountain silhouette */}
    <polygon points="10,72 35,42 50,58 60,44 70,58 85,42 110,72" fill="#2d6a2d" />
    <polygon points="10,72 110,72 110,78 10,78" fill="#2d6a2d" />
    {/* Banner */}
    <rect x="18" y="76" width="84" height="12" fill="#e87722" rx="1" />
    <text x="60" y="86" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#fff" fontFamily="serif">
      ARUNACHAL PRADESH
    </text>
    {/* Stars flanking */}
    <text x="25" y="85" fontSize="6" fill="#fff">★</text>
    <text x="90" y="85" fontSize="6" fill="#fff">★</text>
  </svg>
);

// ─── eILP Permit Card ────────────────────────────────────────────────────────
const EilpPermitCard = ({ review }) => {
  const applicant = review?.applicant || {};
  const members = review?.members || [];
  const eilpNo = generateEilpNo(applicant.aadhaar || "");

  const tdLabel = {
    fontWeight: "bold",
    fontSize: 11,
    padding: "3px 6px",
    border: "1px solid #bbb",
    background: "#f7f7f7",
    whiteSpace: "nowrap",
    verticalAlign: "top",
    width: "28%",
  };
  const tdValue = {
    fontSize: 11,
    padding: "3px 6px",
    border: "1px solid #bbb",
    verticalAlign: "top",
  };
  const tdLabelSm = { ...tdLabel, fontSize: 10, width: "auto" };
  const tdValueSm = { ...tdValue, fontSize: 10 };

  return (
    <div style={{
      width: 620,
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
      border: "2px solid #aaa",
      background: "#fff",
      padding: 0,
      boxSizing: "border-box",
      pageBreakInside: "avoid",
    }}>

      {/* ── Header ── */}
      <div style={{ textAlign: "center", padding: "10px 10px 4px", borderBottom: "1px solid #ccc" }}>
        <APLogo size={80} />
        <div style={{ fontWeight: "bold", fontSize: 15, color: "#1a3a6b", marginTop: 4 }}>
          Government of Arunachal Pradesh
        </div>
        <div style={{ fontSize: 11, color: "#333" }}>
          (Temporary Group Inner Line Permit for Indian Nationals)
        </div>
      </div>

      {/* ── eILP No + QR + Barcode + Photo row ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid #ccc", gap: 8 }}>
        {/* QR */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <QRPlaceholder size={68} />
        </div>

        {/* Center: eILP No + barcode */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontWeight: "bold", fontSize: 14, color: "#1a3a6b" }}>eILP No</div>
          <div style={{ fontWeight: "bold", fontSize: 18, color: "#cc0000", letterSpacing: 1, margin: "2px 0 6px" }}>
            {eilpNo}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BarcodeStripes value={eilpNo} width={200} height={42} />
          </div>
        </div>

        {/* Photo */}
        <PhotoPlaceholder name={applicant.name || ""} size={72} />
      </div>

      {/* ── Caution banner ── */}
      <div style={{
        background: "#fffbe6",
        border: "1.5px solid #e87722",
        color: "#b34000",
        fontSize: 10.5,
        fontWeight: "bold",
        padding: "5px 10px",
        margin: "0",
        lineHeight: 1.4,
      }}>
        Caution: Entering the Check Gate of Arunachal Pradesh along with this eILP Pass. You are mandatory to Produce COVID19 Test Report valid for 72 hours on your arrival date or COVID19 Vaccine Completion Certificate
      </div>

      {/* ── Main details table ── */}
      <table style={{ width: "100%", borderCollapse: "collapse", margin: 0 }}>
        <tbody>
          <tr>
            <td style={tdLabel}>Name</td>
            <td style={tdValue}>{applicant.name || "-"}</td>
          </tr>
          <tr>
            <td style={tdLabel}>Permanent Address</td>
            <td style={tdValue}>{applicant.address || "-"}{applicant.district ? `, ${applicant.district}` : ""}{applicant.state ? `, ${applicant.state}` : ""}{applicant.pincode ? ` ${applicant.pincode}` : ""}</td>
          </tr>
          <tr>
            <td style={tdLabel}>Identification mark</td>
            <td style={tdValue}>-</td>
          </tr>
          <tr>
            <td style={tdLabel}>Reference details</td>
            <td style={tdValue}>{applicant.email || "-"}</td>
          </tr>
        </tbody>
      </table>

      {/* ── 6-column details row ── */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={tdLabelSm}>Gender</td>
            <td style={tdValueSm}>{applicant.gender || "-"}</td>
            <td style={tdLabelSm}>Date of birth</td>
            <td style={tdValueSm}>{applicant.dob || "-"}</td>
            <td style={tdLabelSm}></td>
            <td style={tdValueSm}></td>
          </tr>
          <tr>
            <td style={tdLabelSm}>Occupation</td>
            <td style={tdValueSm}>{applicant.purpose || "-"}</td>
            <td style={tdLabelSm}>Document Verified</td>
            <td style={tdValueSm}>Adhar Card</td>
            <td style={tdLabelSm}></td>
            <td style={tdValueSm}></td>
          </tr>
          <tr>
            <td style={tdLabelSm}>Place of visit</td>
            <td style={tdValueSm}>Arunachal Pradesh</td>
            <td style={tdLabelSm}>Check Gate</td>
            <td style={tdValueSm}>-</td>
            <td style={tdLabelSm}></td>
            <td style={tdValueSm}></td>
          </tr>
          <tr>
            <td style={tdLabelSm}>Date of visit</td>
            <td style={tdValueSm}>-</td>
            <td style={tdLabelSm}>Type of visit</td>
            <td style={tdValueSm}>{applicant.purpose || "Tourist"}</td>
            <td style={tdLabelSm}></td>
            <td style={tdValueSm}></td>
          </tr>
          <tr>
            <td style={tdLabelSm}>Date of return</td>
            <td style={tdValueSm}>-</td>
            <td style={tdLabelSm}></td>
            <td style={tdValueSm}></td>
            <td style={tdLabelSm}></td>
            <td style={tdValueSm}></td>
          </tr>
        </tbody>
      </table>

      {/* ── Issue row ── */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={tdLabelSm}>Place of Issue</td>
            <td style={tdValueSm}>DRC Guwahati</td>
            <td style={tdLabelSm}>Permit Type</td>
            <td style={tdValueSm}>{members.length > 0 ? "Group" : "Individual"}</td>
          </tr>
          <tr>
            <td style={tdLabelSm}>Issuing Authority</td>
            <td style={tdValueSm}>DRC Guwahati</td>
            <td style={tdLabelSm}>Date of Issue</td>
            <td style={tdValueSm}>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })}</td>
          </tr>
        </tbody>
      </table>

      {/* ── Group Member Details ── */}
      <div style={{
        fontWeight: "bold",
        fontSize: 12,
        padding: "4px 8px",
        borderTop: "1.5px solid #aaa",
        borderBottom: members.length ? "none" : "none",
        background: "#f0f4ff",
      }}>
        Group Member Details
      </div>

      {members.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
          <thead>
            <tr style={{ background: "#dde6f5" }}>
              <th style={{ ...tdLabelSm, textAlign: "center" }}>#</th>
              <th style={{ ...tdLabelSm }}>Name</th>
              <th style={{ ...tdLabelSm }}>Relation</th>
              <th style={{ ...tdLabelSm }}>Gender</th>
              <th style={{ ...tdLabelSm }}>DOB</th>
              <th style={{ ...tdLabelSm }}>Aadhaar</th>
              <th style={{ ...tdLabelSm }}>Address</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i}>
                <td style={{ ...tdValueSm, textAlign: "center" }}>{i + 1}</td>
                <td style={tdValueSm}>{m.name || "-"}</td>
                <td style={tdValueSm}>{m.relation || "-"}</td>
                <td style={tdValueSm}>{m.gender || "-"}</td>
                <td style={tdValueSm}>{m.dob || "-"}</td>
                <td style={tdValueSm}>{m.aadhaar || m.aadhar || "-"}</td>
                <td style={tdValueSm}>{m.address || "-"}{m.state ? `, ${m.state}` : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {members.length === 0 && (
        <div style={{ fontSize: 10, color: "#888", padding: "4px 8px", borderTop: "1px solid #ddd" }}>
          No group members added.
        </div>
      )}
    </div>
  );
};


// ─── Main ReviewPage ─────────────────────────────────────────────────────────

function ReviewPage() {
  const [review, setReview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showPermit, setShowPermit] = useState(false);
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const permitRef = useRef(null);

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

  // Render only the permit card as PDF (cleaner output)
  const generatePermitPDF = async () => {
    if (!permitRef.current) return;
    const canvas = await html2canvas(permitRef.current, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    doc.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, 297));
    doc.save(`eILP-${Date.now()}.pdf`);
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

  const onBack = () => navigate(-1);

  const onSave = () => {
    if (!review) return;
    localStorage.setItem("savedReview", JSON.stringify(review));
    setSaved(true);
  };

  const onPrintAndPay = async () => {
    await generatePermitPDF();
  };

  const applicant = review?.applicant || {};

  // ── Background slider (shared) ──
  const BgSlider = () => (
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
  );

  if (!review) {
    return (
      <div className="review-shell">
        <BgSlider />
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
      <BgSlider />

      <div className="review-card">
        {/* ── Top bar ── */}
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

        {/* ── eILP Permit Preview Toggle ── */}
        <div style={{ marginBottom: 16 }}>
          <button
            className={`review-button ${showPermit ? "save" : "primary"}`}
            style={{ marginBottom: 0 }}
            onClick={() => setShowPermit((v) => !v)}
          >
            {showPermit ? "▲ Hide eILP Permit Preview" : "▼ Show eILP Permit Preview"}
          </button>
        </div>

        {showPermit && (
          <div style={{ marginBottom: 24, overflowX: "auto" }}>
            <div ref={permitRef} style={{ display: "inline-block", minWidth: 620, background: "#fff", padding: 12 }}>
              <EilpPermitCard review={review} />
            </div>
          </div>
        )}

        {/* ── Original review grid (unchanged) ── */}
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
                      <strong>Pincode:</strong> {member.pincode || "-"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="review-note">No members were added.</p>
            )}
          </section>
        </div>

        {/* ── Actions ── */}
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