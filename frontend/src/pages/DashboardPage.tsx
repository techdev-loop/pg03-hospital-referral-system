import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReferralForm from "../components/ReferralForm";
import ReferralList from "../components/ReferralList";
import { getReferrals, ReferralResponse } from "../api";

function getUserEmail(): string {
  try {
    const raw = localStorage.getItem("auth_user");
    if (raw) return JSON.parse(raw).email ?? "User";
  } catch {
    // ignore
  }
  return "User";
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState<ReferralResponse[]>([]);
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");

  function handleLogout() {
    localStorage.removeItem("auth_user");
    navigate("/login");
  }

  function handleReferralCreated(r: ReferralResponse) {
    setReferrals((prev) => [r, ...prev]);
    setActiveTab("list");
  }

  useEffect(() => {
    getReferrals()
      .then(setReferrals)
      .catch(() => {
        // backend may not be up; silently start with empty list
      });
  }, []);

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="topbar-brand">
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="white" />
            <text x="50" y="72" fontSize="64" textAnchor="middle" fill="#2563eb" fontFamily="Arial" fontWeight="bold">+</text>
          </svg>
          <span>Referral System</span>
        </div>
        <div className="topbar-right">
          <span className="topbar-user">{getUserEmail()}</span>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="page-header">
            <h2>Dashboard</h2>
            <p>Manage and create patient referrals</p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">{referrals.length}</span>
              <span className="stat-label">Total Referrals</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{referrals.filter((r) => r.priority === "HIGH").length}</span>
              <span className="stat-label">High Priority</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{referrals.filter((r) => r.status === "ACCEPTED").length}</span>
              <span className="stat-label">Accepted</span>
            </div>
          </div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === "create" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              Create Referral
            </button>
            <button
              className={`tab ${activeTab === "list" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("list")}
            >
              Referral History
              {referrals.length > 0 && <span className="badge">{referrals.length}</span>}
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "create" && (
              <div className="card">
                <h3>New Patient Referral</h3>
                <p className="text-muted">Complete the form below to submit a referral request.</p>
                <ReferralForm onSuccess={handleReferralCreated} />
              </div>
            )}
            {activeTab === "list" && (
              <ReferralList referrals={referrals} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
