import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { 
  Trash2, 
  Plus, 
  Download, 
  BarChart2, 
  Table, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  RotateCcw, 
  Check, 
  HelpCircle,
  Truck
} from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Initial Excel data from "Product Rate Sheet 10percentage"
const INIT = [
  { id: 1,  sr: 1,  name: "Naruto 9 Classic  UC 22 Oversize",      tshirt: 265,   cost: 675,   remark: "Front and Back",                    delivery: 50, qty: 15 },
  { id: 2,  sr: 2,  name: "Plain Regular Classic",                  tshirt: 199.5, cost: 223,   remark: "Plain T shirt",                     delivery: 50, qty: 8 },
  { id: 3,  sr: 3,  name: "Plain Oversized Classic",                tshirt: 278,   cost: 301,   remark: "Plain T shirt",                     delivery: 50, qty: 12 },
  { id: 4,  sr: 4,  name: "Left Pocket Printed oversized",          tshirt: 278,   cost: 320,   remark: "Only Left Pocket (Plain T shirt)",  delivery: 50, qty: 5 },
  { id: 5,  sr: 5,  name: "Left Pocket Printed Regular",            tshirt: 199.5, cost: 262.5, remark: "Only Left Pocket (Plain T shirt)",  delivery: 50, qty: 20 },
  { id: 6,  sr: 6,  name: "Oversized Back Print Classic",           tshirt: 278,   cost: 410,   remark: "Back Only",                         delivery: 50, qty: 0 },
  { id: 7,  sr: 7,  name: "Regular Double-Sided Graphics",          tshirt: 199.5, cost: 350,   remark: "Double-Sided Premium",              delivery: 50, qty: 0 },
  { id: 8,  sr: 8,  name: "",                                       tshirt: 0,     cost: 0,     remark: "",                                  delivery: 50, qty: 0 },
  { id: 9,  sr: 9,  name: "",                                       tshirt: 0,     cost: 0,     remark: "",                                  delivery: 50, qty: 0 },
  { id: 10, sr: 10, name: "",                                       tshirt: 0,     cost: 0,     remark: "",                                  delivery: 50, qty: 0 },
];

const n = v => parseFloat(v) || 0;

const INR = v => {
  const value = n(v);
  return "₹" + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const FMT = v => {
  const num = n(v);
  if (num === 0) return <span className="zero-val">0</span>;
  return num % 1 === 0 ? num.toLocaleString("en-IN") : num.toFixed(2);
};

// Excel formulas reproduced exactly:
// F = D*10/100
// G = D+F
// I = G+H
// K = J*F
// L = J*G
const calc = r => {
  const D = n(r.cost), H = n(r.delivery), J = n(r.qty);
  const F = D * 10 / 100;
  const G = D + F;
  const I = G + H;
  const K = J * F;
  const L = J * G;
  return { F, G, I, K, L };
};

export default function App() {
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem("inkthread_rows");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INIT; }
    }
    return INIT;
  });
  const [activeTab, setActiveTab] = useState("sheet"); // "sheet" or "analytics"

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem("inkthread_rows", JSON.stringify(rows));
  }, [rows]);

  const upd = (id, field, val) => {
    // If it's a numeric field, convert to number or empty string
    let parsedVal = val;
    if (["tshirt", "cost", "delivery", "qty"].includes(field)) {
      parsedVal = val === "" ? "" : n(val);
    }
    setRows(p => p.map(r => r.id === id ? { ...r, [field]: parsedVal } : r));
  };

  const addRow = () =>
    setRows(p => [
      ...p, 
      { id: Date.now(), sr: p.length + 1, name: "", tshirt: 0, cost: 0, remark: "", delivery: 50, qty: 0 }
    ]);

  const delRow = id =>
    setRows(p => p.filter(r => r.id !== id).map((r, i) => ({ ...r, sr: i + 1 })));

  const resetTable = () => {
    if (window.confirm("Are you sure you want to reset the rate sheet to default values?")) {
      setRows(INIT);
    }
  };

  // Grand Total Calculations — exact Excel formulas
  const sumC  = rows.reduce((a, r) => a + n(r.tshirt),   0);
  const sumD  = rows.reduce((a, r) => a + n(r.cost),     0);
  const sumH  = rows.reduce((a, r) => a + n(r.delivery), 0);
  const sumI  = rows.reduce((a, r) => a + calc(r).I,     0);
  const sumJ  = rows.reduce((a, r) => a + n(r.qty),      0);
  const sumK  = rows.reduce((a, r) => a + calc(r).K,     0);
  const sumL  = rows.reduce((a, r) => a + calc(r).L,     0);
  
  // Grand Total Margin = SUM(D)*20/100  (as per original Excel formula)
  const gtF   = sumD * 20 / 100;
  // Grand Total Sell = SUM(D) + gtF
  const gtG   = sumD + gtF;

  // Export to Excel function using sheetjs
  const exportToExcel = () => {
    const formattedData = rows.map(r => {
      const { F, G, I, K, L } = calc(r);
      return {
        "Sr.": r.sr,
        "Product Name": r.name || "N/A",
        "Only T-shirt Charge (C)": n(r.tshirt),
        "T-shirt Cost+Printing (D)": n(r.cost),
        "Remark (E)": r.remark,
        "Margin (F = Dx10%)": F,
        "Selling Price (G = D+F)": G,
        "Delivery Charge (H)": n(r.delivery),
        "Final Price (I = G+H)": I,
        "Sales Qty (J)": n(r.qty),
        "Total Margin (K = JxF)": K,
        "Total Selling Price (L = JxG)": L
      };
    });

    // Append Grand Total Row
    formattedData.push({
      "Sr.": "",
      "Product Name": "GRAND TOTAL",
      "Only T-shirt Charge (C)": sumC,
      "T-shirt Cost+Printing (D)": sumD,
      "Remark (E)": "",
      "Margin (F = Dx10%)": gtF, // SUM(D) * 20%
      "Selling Price (G = D+F)": gtG, // SUM(D) + gtF
      "Delivery Charge (H)": sumH,
      "Final Price (I = G+H)": sumI,
      "Sales Qty (J)": sumJ,
      "Total Margin (K = JxF)": sumK,
      "Total Selling Price (L = JxG)": sumL
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "June Sales Chart");

    // Auto-fit column width
    const max_width = formattedData.reduce((w, r) => Object.keys(r).map(key => Math.max(w, key.length, String(r[key]).length)), 10);
    worksheet["!cols"] = Object.keys(formattedData[0]).map(() => ({ wch: 15 }));

    XLSX.writeFile(workbook, "Inkthread_Hub_Sales_Chart_June.xlsx");
  };

  // Filter out empty rows for charts to avoid rendering empty data
  const validProducts = rows.filter(r => r.name.trim() !== "" && (n(r.cost) > 0 || n(r.qty) > 0));

  // Chart 1: Revenue vs Cost per product
  const comparisonChartData = {
    labels: validProducts.map(r => r.name.length > 25 ? r.name.substring(0, 22) + "..." : r.name),
    datasets: [
      {
        label: "Unit Cost (D)",
        data: validProducts.map(r => n(r.cost)),
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderColor: "rgba(255, 255, 255, 0.4)",
        borderWidth: 1,
      },
      {
        label: "Unit Selling Price (G)",
        data: validProducts.map(r => calc(r).G),
        backgroundColor: "rgba(201, 168, 76, 0.75)",
        borderColor: "var(--gold)",
        borderWidth: 1,
      }
    ]
  };

  // Chart 2: Total Revenue contribution (Total Selling Price)
  const revenueContributionData = {
    labels: validProducts.map(r => r.name.length > 20 ? r.name.substring(0, 18) + "..." : r.name),
    datasets: [
      {
        label: "Total Sales Value",
        data: validProducts.map(r => calc(r).L),
        backgroundColor: [
          "#C9A84C",
          "#E6C66D",
          "#A88734",
          "#846A24",
          "#4D5C68",
          "#2A3439",
          "#D4AF37",
          "#996515",
          "#705335",
          "#4A3B32"
        ],
        borderWidth: 0,
      }
    ]
  };

  return (
    <div className="app-container">
      {/* Sidebar Layout */}
      <aside className="sidebar" id="appSidebar">
        <div className="logo-section">
          <div className="logo-title">Inkthread Hub</div>
          <div className="logo-subtitle">Sales & Margin Dashboard</div>
        </div>

        <nav className="nav-menu">
          <button 
            className={`nav-btn ${activeTab === "sheet" ? "active" : ""}`}
            onClick={() => setActiveTab("sheet")}
            id="navBtnSheet"
          >
            <Table size={16} /> Rate Sheet
          </button>
          <button 
            className={`nav-btn ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
            id="navBtnAnalytics"
          >
            <BarChart2 size={16} /> Analytics
          </button>
        </nav>

        <div className="sidebar-footer">
          <div>JUNE FY 2026-27</div>
          <div style={{ marginTop: 4, opacity: 0.5 }}>v2.0 Premium</div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="main-viewport">
        {/* Header */}
        <header className="top-header">
          <div className="header-left">
            <h1>Sales Chart — June 2026-27</h1>
            <p>Product Rate Sheet & Real-time Profit Estimator · Margin Model: 10%</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn-outline-gold" 
              onClick={resetTable}
              title="Reset Table to default"
              id="resetTableBtn"
            >
              <RotateCcw size={14} /> Reset Data
            </button>
            <button 
              className="btn-gold" 
              onClick={exportToExcel}
              id="exportExcelBtn"
            >
              <Download size={14} /> Export Excel
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="content-body">
          {/* Key Metrics Cards */}
          <div className="summary-grid">
            <div className="glass-card stat-card">
              <div className="stat-info">
                <span className="stat-label">Total Quantity Sold</span>
                <span className="stat-value">{sumJ.toLocaleString()}</span>
              </div>
              <div className="stat-icon-wrap">
                <TrendingUp size={24} />
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-info">
                <span className="stat-label">Total Estimated Cost</span>
                <span className="stat-value">{INR(sumD * sumJ / (rows.length || 1))}</span>
              </div>
              <div className="stat-icon-wrap">
                <DollarSign size={24} />
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-info">
                <span className="stat-label">Total Estimated Margin</span>
                <span className="stat-value">{INR(sumK)}</span>
              </div>
              <div className="stat-icon-wrap">
                <Percent size={24} />
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-info">
                <span className="stat-label">Total Selling Price</span>
                <span className="stat-value">{INR(sumL)}</span>
              </div>
              <div className="stat-icon-wrap">
                <DollarSign size={24} />
              </div>
            </div>
          </div>

          {activeTab === "sheet" ? (
            /* RATE SHEET TAB */
            <div className="glass-card">
              <div className="app-alert info">
                <HelpCircle size={16} />
                <span>
                  <strong>Formulas Info:</strong> Columns in <span style={{color: "var(--formula-blue)"}}>blue text</span> are calculated automatically. Individual margins are set to <strong>10%</strong>. Grand Total Margin uses a <strong>20%</strong> scaling factor as requested.
                </span>
              </div>

              <div className="legend-section" style={{ marginBottom: 16 }}>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-subtle)" }}></div>
                  <span>Editable Fields</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: "var(--formula-blue)" }}></div>
                  <span>Formula Fields</span>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="rate-table">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>Sr.</th>
                      <th style={{ width: 260 }}>Product Name</th>
                      <th>Only T-shirt<br/>Charge<br/><span className="col-letter">C</span></th>
                      <th>Cost + Print<br/>Charge<br/><span className="col-letter">D</span></th>
                      <th style={{ width: 220 }}>Remark<br/><span className="col-letter">E</span></th>
                      <th>Margin<br/><span className="col-letter">D × 10% (F)</span></th>
                      <th>Selling<br/>Price<br/><span className="col-letter">D + F (G)</span></th>
                      <th>Delivery<br/>Charge<br/><span className="col-letter">H</span></th>
                      <th>Final<br/>Price<br/><span className="col-letter">G + H (I)</span></th>
                      <th style={{ width: 90 }}>Sales<br/>Qty<br/><span className="col-letter">J</span></th>
                      <th>Total<br/>Margin<br/><span className="col-letter">J × F (K)</span></th>
                      <th>Total Selling<br/>Price<br/><span className="col-letter">J × G (L)</span></th>
                      <th style={{ width: 50 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => {
                      const { F, G, I, K, L } = calc(r);
                      return (
                        <tr key={r.id}>
                          <td>
                            <span className="cell-display center" style={{ color: "var(--text-secondary)" }}>
                              {r.sr}
                            </span>
                          </td>
                          <td>
                            <input 
                              className="table-input left" 
                              value={r.name} 
                              onChange={e => upd(r.id, "name", e.target.value)}
                              placeholder="Add product name..."
                            />
                          </td>
                          <td>
                            <input 
                              className="table-input" 
                              type="number" 
                              value={r.tshirt === "" ? "" : r.tshirt} 
                              onChange={e => upd(r.id, "tshirt", e.target.value)}
                              placeholder="0"
                            />
                          </td>
                          <td>
                            <input 
                              className="table-input" 
                              type="number" 
                              value={r.cost === "" ? "" : r.cost} 
                              onChange={e => upd(r.id, "cost", e.target.value)}
                              placeholder="0"
                            />
                          </td>
                          <td>
                            <input 
                              className="table-input left" 
                              value={r.remark} 
                              onChange={e => upd(r.id, "remark", e.target.value)}
                              placeholder="Add remarks..."
                            />
                          </td>
                          <td>
                            <span className="cell-display formula">{FMT(F)}</span>
                          </td>
                          <td>
                            <span className="cell-display formula">{FMT(G)}</span>
                          </td>
                          <td>
                            <input 
                              className="table-input" 
                              type="number" 
                              value={r.delivery === "" ? "" : r.delivery} 
                              onChange={e => upd(r.id, "delivery", e.target.value)}
                              placeholder="50"
                            />
                          </td>
                          <td>
                            <span className="cell-display formula">{FMT(I)}</span>
                          </td>
                          <td>
                            <input 
                              className="table-input center" 
                              type="number" 
                              value={r.qty === "" ? "" : r.qty} 
                              onChange={e => upd(r.id, "qty", e.target.value)}
                              placeholder="0"
                            />
                          </td>
                          <td>
                            <span className="cell-display formula">{FMT(K)}</span>
                          </td>
                          <td>
                            <span className="cell-display formula" style={{ fontWeight: 700 }}>{INR(L)}</span>
                          </td>
                          <td>
                            <button 
                              className="btn-delete" 
                              onClick={() => delRow(r.id)}
                              title="Delete row"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Grand Total Row */}
                    <tr className="grand-total">
                      <td colSpan={2}>
                        <span className="cell-display left" style={{ color: "var(--gold)", fontWeight: 700, letterSpacing: 2 }}>
                          GRAND TOTAL
                        </span>
                      </td>
                      <td><span className="cell-display">{FMT(sumC)}</span></td>
                      <td><span className="cell-display">{FMT(sumD)}</span></td>
                      <td></td>
                      <td>
                        <span className="cell-display formula" title="SUM(D) × 20%">
                          {FMT(gtF)}
                        </span>
                      </td>
                      <td>
                        <span className="cell-display formula" title="SUM(D) + Grand Margin">
                          {FMT(gtG)}
                        </span>
                      </td>
                      <td><span className="cell-display">{FMT(sumH)}</span></td>
                      <td><span className="cell-display formula">{FMT(sumI)}</span></td>
                      <td><span className="cell-display">{FMT(sumJ)}</span></td>
                      <td><span className="cell-display formula">{INR(sumK)}</span></td>
                      <td><span className="cell-display formula" style={{ color: "var(--gold)" }}>{INR(sumL)}</span></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 20 }}>
                <button className="btn-outline-gold" onClick={addRow} id="addRowBtn">
                  <Plus size={14} /> Add New Row
                </button>
              </div>
            </div>
          ) : (
            /* ANALYTICS TAB */
            <div className="analytics-grid">
              <div className="glass-card">
                <h3 style={{ marginBottom: 20, fontFamily: "Bebas Neue", letterSpacing: 1.5, color: "var(--gold)" }}>
                  Unit Cost vs Unit Selling Price
                </h3>
                {validProducts.length > 0 ? (
                  <div className="chart-container">
                    <Bar 
                      data={comparisonChartData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { labels: { color: "#a0a0a0", font: { family: "Barlow" } } }
                        },
                        scales: {
                          x: { grid: { color: "#222" }, ticks: { color: "#a0a0a0" } },
                          y: { grid: { color: "#222" }, ticks: { color: "#a0a0a0" } }
                        }
                      }} 
                    />
                  </div>
                ) : (
                  <div className="empty-data">
                    <BarChart2 size={36} />
                    <p>No product data available to graph. Enter values in the Rate Sheet.</p>
                  </div>
                )}
              </div>

              <div className="glass-card">
                <h3 style={{ marginBottom: 20, fontFamily: "Bebas Neue", letterSpacing: 1.5, color: "var(--gold)" }}>
                  Total Revenue Contribution
                </h3>
                {validProducts.length > 0 ? (
                  <div className="chart-container" style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "80%", height: "100%" }}>
                      <Doughnut 
                        data={revenueContributionData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "right",
                              labels: { color: "#a0a0a0", font: { family: "Barlow", size: 11 } }
                            }
                          }
                        }} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="empty-data">
                    <BarChart2 size={36} />
                    <p>No product data available to graph. Enter values in the Rate Sheet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Credits banner */}
          <footer className="credits-banner">
            &copy; 2026 INKTHREAD HUB. All rights reserved. Created for premium print pricing and sales chart analysis.
          </footer>
        </div>
      </main>
    </div>
  );
}
