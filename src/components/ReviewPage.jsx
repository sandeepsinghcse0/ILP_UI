import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apLogo from "../assets/logoAPState.png";
import "../styles/review.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

// ─── Storage helper ──────────────────────────────────────────────────────────
const getReviewFromStorage = () => {
  try {
    const lastReview = localStorage.getItem("lastReview");
    if (lastReview) return JSON.parse(lastReview);
    const applications = JSON.parse(localStorage.getItem("ilpApplications")) || [];
    return applications.length ? applications[applications.length - 1] : null;
  } catch {
    return null;
  }
};

// ─── eILP number generator ───────────────────────────────────────────────────
const generateEilpNo = (aadhaar) => {
  if (aadhaar && aadhaar.length >= 8) {
    return `0${aadhaar.slice(0, 3)}${aadhaar.slice(3, 7)}${aadhaar.slice(7, 11)}${aadhaar.slice(-1)}203`;
  }
  return `0211245660409203`;
};

// ─── Real Code 128B Barcode ──────────────────────────────────────────────────
const C128 = [
  "11011001100","11001101100","11001100110","10010011000","10010001100",
  "10001001100","10011001000","10011000100","10001100100","11001001000",
  "11001000100","11000100100","10110011100","10011011100","10011001110",
  "10111001100","10011101100","10011100110","11001110010","11001011100",
  "11001001110","11011100100","11001110100","11101101110","11101001100",
  "11100101100","11100100110","11101100100","11100110100","11100110010",
  "11011011000","11011000110","11000110110","10100011000","10001011000",
  "10001000110","10110001000","10001101000","10001100010","11010001000",
  "11000101000","11000100010","10110111000","10110001110","10001101110",
  "10111011000","10111000110","10001110110","11101110110","11010001110",
  "11000101110","11011101000","11011100010","11011101110","11101011000",
  "11101000110","11100010110","11101101000","11101100010","11100011010",
  "11101111010","11001000010","11110001010","10100110000","10100001100",
  "10010110000","10010000110","10000101100","10000100110","10110010000",
  "10110000100","10011010000","10011000010","10000110100","10000110010",
  "11000010010","11001010000","11110111010","11000010100","10001111010",
  "10100111100","10010111100","10010011110","10111100100","10011110100",
  "10011110010","11110100100","11110010100","11110010010","11011011110",
  "11011110110","11110110110","10101111000","10100011110","10001011110",
  "10111101000","10111100010","11110101000","11110100010","10111011110",
  "10111101110","11101011110","11110101110","11010000100","11010010000",
  "11010011100",
];
const C128_START_B = "11010010000";
const C128_STOP    = "1100011101011";

const encodeCode128B = (text) => {
  const vals = [];
  for (let i = 0; i < text.length; i++) {
    const v = text.charCodeAt(i) - 32;
    if (v >= 0 && v <= 94) vals.push(v);
  }
  let cs = 104;
  for (let i = 0; i < vals.length; i++) cs += (i + 1) * vals[i];
  cs = cs % 103;
  return [C128_START_B, ...vals.map((v) => C128[v]), C128[cs], C128_STOP].join("");
};

const BarcodeStripes = ({ value = "", width = 260, height = 46 }) => {
  const bits = encodeCode128B(value);
  const quietModules = 10;
  const totalModules = bits.length + quietModules * 2;
  const mod = width / totalModules;
  const offsetX = quietModules * mod;
  const rects = [];
  let idx = 0;
  while (idx < bits.length) {
    const bit = bits[idx];
    let run = 0;
    while (idx + run < bits.length && bits[idx + run] === bit) run++;
    if (bit === "1") {
      rects.push(
        <rect key={idx} x={offsetX + idx * mod} y={0} width={run * mod} height={height} fill="#000" />
      );
    }
    idx += run;
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block", imageRendering: "crisp-edges" }}>
      <rect width={width} height={height} fill="#fff" />
      {rects}
    </svg>
  );
};

// ─── Photo placeholder ────────────────────────────────────────────────────────
const PhotoPlaceholder = ({ name = "", size = 90, photoDataUrl = "" }) => (
  <div style={{
    width: size, height: size + 10, border: "1.5px solid #888",
    background: "#e8e8e8", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", fontSize: 9, color: "#555", textAlign: "center",
    overflow: "hidden",
  }}>
    {photoDataUrl ? (
      <img
        src={photoDataUrl}
        alt={name ? `${name} photo` : "Applicant photo"}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    ) : (
      <>
        <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 40 40" fill="#aaa">
          <circle cx="20" cy="14" r="9" />
          <ellipse cx="20" cy="34" rx="15" ry="10" />
        </svg>
        <span style={{ fontSize: 8, marginTop: 2 }}>{name.split(" ")[0] || "Photo"}</span>
      </>
    )}
  </div>
);

// ─── eILP Permit Card (full-width, real logo) ────────────────────────────────
const EilpPermitCard = ({ review }) => {
  const applicant = review?.applicant || {};
  const members   = review?.members  || [];
  const eilpNo    = generateEilpNo(applicant.aadhaar || "");
  const issuedOnStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });

  const qrPayload = JSON.stringify({
    type: "eILP",
    no: eilpNo,
    name: applicant.name || "",
    issuedOn: issuedOnStr,
  });

  const tdLabel = {
    fontWeight: "bold", fontSize: 11, padding: "4px 8px",
    border: "1px solid #bbb", background: "#f7f7f7",
    whiteSpace: "nowrap", verticalAlign: "top", width: "26%",
  };
  const tdValue = {
    fontSize: 11, padding: "4px 8px",
    border: "1px solid #bbb", verticalAlign: "top",
  };
  const tdSm  = { ...tdLabel, fontSize: 10, width: "auto" };
  const tdVSm = { ...tdValue, fontSize: 10 };

  return (
    <div style={{
      width: "100%", fontFamily: "Arial, sans-serif",
      border: "2px solid #aaa", background: "#fff",
      boxSizing: "border-box",
    }}>

      {/* ── Header with real logo ── */}
      <div style={{
        textAlign: "center", padding: "14px 12px 8px",
        borderBottom: "1px solid #ccc",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      }}>
        <img
          src={apLogo}
          alt="Arunachal Pradesh State Emblem"
          style={{ height: 80, width: "auto", objectFit: "contain" }}
        />
        <div style={{ fontWeight: "bold", fontSize: 16, color: "#1a3a6b" }}>
          Government of Arunachal Pradesh
        </div>
        <div style={{ fontSize: 12, color: "#333" }}>
          Temporary Group Inner Line Permit for Indian Nationals
        </div>
      </div>

      {/* ── eILP No + QR + Barcode + Photo ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px", borderBottom: "1px solid #ccc", gap: 12,
      }}>
        <div style={{ border: "2px solid #000", padding: 2, background: "#fff" }}>
          <QRCodeCanvas
            value={qrPayload}
            size={80}
            level="M"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontWeight: "bold", fontSize: 13, color: "#1a3a6b" }}>eILP No</div>
          <div style={{ fontWeight: "bold", fontSize: 20, color: "#cc0000", letterSpacing: 1, margin: "3px 0 8px" }}>
            {eilpNo}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BarcodeStripes value={eilpNo} width={260} height={46} />
          </div>
        </div>
        <PhotoPlaceholder name={applicant.name || ""} size={90} photoDataUrl={applicant.photoDataUrl || ""} />
      </div>

      {/* ── Caution banner ── */}
      <div style={{
        background: "#fffbe6", border: "1.5px solid #e87722",
        color: "#b34000", fontSize: 10.5, fontWeight: "bold",
        padding: "6px 12px", lineHeight: 1.4,
      }}>
        Caution: Entering the Check Gate of Arunachal Pradesh along with this eILP Pass. You are mandatory
        to produce COVID-19 Test Report valid for 72 hours on your arrival date or COVID-19 Vaccine
        Completion Certificate.
      </div>

      {/* ── Main applicant table ── */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={tdLabel}>Name</td>
            <td style={tdValue}>{applicant.name || "-"}</td>
          </tr>
          <tr>
            <td style={tdLabel}>Permanent Address</td>
            <td style={tdValue}>
              {[applicant.address, applicant.district, applicant.state, applicant.pincode]
                .filter(Boolean).join(", ") || "-"}
            </td>
          </tr>
          <tr>
            <td style={tdLabel}>Identification Mark</td>
            <td style={tdValue}>-</td>
          </tr>
          <tr>
            <td style={tdLabel}>Reference Details</td>
            <td style={tdValue}>{applicant.email || "-"}</td>
          </tr>
        </tbody>
      </table>

      {/* ── 6-column details ── */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={tdSm}>Gender</td>
            <td style={tdVSm}>{applicant.gender || "-"}</td>
            <td style={tdSm}>Date of Birth</td>
            <td style={tdVSm}>{applicant.dob || "-"}</td>
            <td style={tdSm}>Mobile</td>
            <td style={tdVSm}>{applicant.mobile || "-"}</td>
          </tr>
          <tr>
            <td style={tdSm}>Purpose of Visit</td>
            <td style={tdVSm}>{applicant.purpose || "-"}</td>
            <td style={tdSm}>Document Verified</td>
            <td style={tdVSm}>Aadhaar Card</td>
            <td style={tdSm}>Aadhaar No.</td>
            <td style={tdVSm}>{applicant.aadhaar || "-"}</td>
          </tr>
          <tr>
            <td style={tdSm}>Place of Visit</td>
            <td style={tdVSm}>Arunachal Pradesh</td>
            <td style={tdSm}>Check Gate</td>
            <td style={tdVSm}>-</td>
            <td style={tdSm}>Citizenship</td>
            <td style={tdVSm}>{applicant.citizenship || "India"}</td>
          </tr>
          <tr>
            <td style={tdSm}>Date of Visit</td>
            <td style={tdVSm}>{applicant.visitFrom || "-"}</td>
            <td style={tdSm}>Type of Visit</td>
            <td style={tdVSm}>{applicant.purpose || "-"}</td>
            <td style={tdSm}>Date of Return</td>
            <td style={tdVSm}>{applicant.visitTo || "-"}</td>
          </tr>
          <tr>
            <td style={tdSm}>Vehicle Travel</td>
            <td style={tdVSm}>{applicant.vehicleTravel || "N/A"}</td>
            <td style={tdSm}>Vehicle Number</td>
            <td style={tdVSm} colSpan={3}>
              {applicant.vehicleTravel === "Yes" ? (applicant.vehicleNumber || "-") : "N/A"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Issue details ── */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={tdSm}>Place of Issue</td>
            <td style={tdVSm}>DRC Guwahati</td>
            <td style={tdSm}>Permit Type</td>
            <td style={tdVSm}>{members.length > 0 ? "Group" : "Individual"}</td>
          </tr>
          <tr>
            <td style={tdSm}>Issuing Authority</td>
            <td style={tdVSm}>DRC Guwahati</td>
            <td style={tdSm}>Date of Issue</td>
            <td style={tdVSm}>
              {issuedOnStr}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Group members ── */}
      <div style={{
        fontWeight: "bold", fontSize: 12, padding: "5px 10px",
        borderTop: "1.5px solid #aaa", background: "#f0f4ff",
      }}>
        Group Member Details
      </div>

      {members.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
          <thead>
            <tr style={{ background: "#dde6f5" }}>
              {["#","Name","Relation","Gender","DOB","Aadhaar","Address"].map((h) => (
                <th key={h} style={{ ...tdSm, textAlign: h === "#" ? "center" : "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i}>
                <td style={{ ...tdVSm, textAlign: "center" }}>{i + 1}</td>
                <td style={tdVSm}>{m.name || "-"}</td>
                <td style={tdVSm}>{m.relation || "-"}</td>
                <td style={tdVSm}>{m.gender || "-"}</td>
                <td style={tdVSm}>{m.dob || "-"}</td>
                <td style={tdVSm}>{m.aadhaar || m.aadhar || "-"}</td>
                <td style={tdVSm}>{[m.address, m.state].filter(Boolean).join(", ") || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ fontSize: 10, color: "#888", padding: "5px 10px", borderTop: "1px solid #ddd" }}>
          No group members added.
        </div>
      )}
    </div>
  );
};

// ─── Main ReviewPage ──────────────────────────────────────────────────────────
function ReviewPage() {
  const [review, setReview]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved]     = useState(false);
  const navigate  = useNavigate();
  const permitRef = useRef(null);

  useEffect(() => {
    setReview(getReviewFromStorage());
    setLoading(false);
  }, []);

  const onBack = () => navigate(-1);

  const onSave = () => {
    if (!review) return;
    localStorage.setItem("savedReview", JSON.stringify(review));
    setSaved(true);
  };

  const onDownloadPDF = async () => {
    if (!permitRef.current) return;
    const canvas = await html2canvas(permitRef.current, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });
    const imgData  = canvas.toDataURL("image/png");
    const doc      = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    doc.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, 297));
    doc.save(`eILP-${Date.now()}.pdf`);
  };

  if (loading) {
    return (
      <div className="review-shell">
        <div className="review-card review-empty-card">
          <p className="review-hero-text">Loading…</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="review-shell">
        <div className="review-card review-empty-card">
          <span className="review-label">Inner Line Permit</span>
          <h1>No submission data found</h1>
          <p className="review-hero-text">
            Please complete the ILP form first, then come back here to review your application.
          </p>
          <div className="review-actions">
            <button className="review-button primary" onClick={onBack}>Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="review-shell">

      {/* ── Page header ── */}
      <div className="review-card" style={{ marginBottom: 16 }}>
        <div className="review-topbar">
          <div>
            <span className="review-label">Inner Line Permit</span>
            <h1>Review your eILP</h1>
            <p className="review-hero-text">
              Verify all details below — this is exactly how your permit will be printed.
            </p>
          </div>
          <div className="status-tag">Ready to review</div>
        </div>
      </div>

      {/* ── Permit card (what you see = what you print) ── */}
      <div className="review-card" style={{ padding: 0, overflow: "auto" }}>
        <div ref={permitRef}>
          <EilpPermitCard review={review} />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="review-card" style={{ marginTop: 16 }}>
        <div className="review-actions">
          <button className="review-button secondary" onClick={onBack}>Back</button>
          <button className="review-button save"      onClick={onSave}>Save</button>
          <button className="review-button primary"   onClick={onDownloadPDF}>Print / Download PDF</button>
        </div>
        {saved && <p className="review-saved">Application saved locally.</p>}
      </div>

    </div>
  );
}

export default ReviewPage;