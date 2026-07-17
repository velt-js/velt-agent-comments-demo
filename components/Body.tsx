"use client";

import { DownloadIcon } from "./icons";

// Static stand-in for the legal document viewer behind the comments panel
// (ported from the altana-wireframes reference). This component owns the
// document chrome: the type tabs, the page, and the floating page/zoom toolbar.
export function Body() {
  return (
    <div className="hv-doc">
      <div className="hv-doc-tabs">
        <span className="hv-doc-tab hv-doc-tab--active">
          <span className="hv-doc-tab-dot" />
          Side Letter
        </span>
        <span className="hv-doc-tab">PDF</span>
        <span className="hv-doc-tab-date">Last edited 25 Nov · 12/2026</span>
      </div>
      <div className="hv-doc-stage">
        <div className="hv-doc-page">
          <p className="hv-doc-exhibit">EX-10.2 3 a15-17870_1ex10d2.htm EX-10.2</p>
          <h4>COMMERCIAL MANUFACTURING AND SUPPLY AGREEMENT</h4>
          <p className="hv-doc-line">
            This Commercial Manufacturing and Supply Agreement (this “Agreement”) is entered into by and between AGILENT
            TECHNOLOGIES, INC., a Delaware corporation, having a principal office at 5301 Stevens Creek Blvd., Santa Clara, CA 95051.
          </p>
          <p className="hv-doc-line">
            In consideration of the mutual covenants and promises set forth herein, the Parties hereby agree as follows:
          </p>
          <h5>1. SCOPE OF AGREEMENT</h5>
          <p className="hv-doc-line">
            This Agreement, together with the Quality Agreement (as defined below) specifies the terms and conditions under which
            Agilent will manufacture and supply the Product (as defined below) to Customer and perform Manufacturing Services.
          </p>
          <h5>2. DEFINITIONS</h5>
          <p className="hv-doc-line">
            2.1 “Affiliate” means any business entity which directly or indirectly controls, is controlled by, or is under common
            control with any Party to this Agreement.
          </p>
          <p className="hv-doc-line">
            2.2 “Anti-PHGF Antigen” means (i) an Agilent-built bispecific growth factor (PDGF) and (ii) intermediates thereof.
          </p>
          <p className="hv-doc-line">
            2.3 “Active Pharmaceutical Ingredient (API)” has the meaning set forth in the Quality Agreement.
          </p>
        </div>
      </div>
      <div className="hv-doc-toolbar" role="toolbar" aria-label="Document controls">
        <button className="hv-tb-btn" type="button" aria-label="Previous page">‹</button>
        <span className="hv-tb-page">
          Page 1 <span className="hv-tb-page-total">/ 12</span>
        </span>
        <button className="hv-tb-btn" type="button" aria-label="Next page">›</button>
        <span className="hv-tb-sep" />
        <button className="hv-tb-btn" type="button" aria-label="Download">
          <DownloadIcon />
        </button>
        <span className="hv-tb-sep" />
        <button className="hv-tb-btn" type="button" aria-label="Zoom out">−</button>
        <span className="hv-tb-zoom">100%</span>
        <button className="hv-tb-btn" type="button" aria-label="Zoom in">+</button>
      </div>
    </div>
  );
}

export default Body;
