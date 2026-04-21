import { ReferralResponse } from "../api";

interface Props {
  referrals: ReferralResponse[];
}

const PRIORITY_CLASSES: Record<string, string> = {
  HIGH: "badge-high",
  MEDIUM: "badge-medium",
  LOW: "badge-low",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReferralList({ referrals }: Props) {
  if (referrals.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-icon">📋</div>
        <p>No referrals yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="referral-list">
      {referrals.map((r) => (
        <div className="referral-card" key={r.id}>
          <div className="referral-card-header">
            <div>
              <span className="referral-id">{r.id}</span>
              <h4>{r.patient.fullName}</h4>
              <span className="text-muted">DOB: {formatDate(r.patient.dateOfBirth)}</span>
            </div>
            <div className="referral-badges">
              <span className={`badge ${PRIORITY_CLASSES[r.priority]}`}>{r.priority}</span>
              <span className="badge badge-status">{r.status}</span>
            </div>
          </div>
          <div className="referral-card-body">
            <p className="reason-text">{r.reason}</p>
            <div className="referral-meta">
              <span>Referred by: <strong>{r.requester.name}</strong> · {r.requester.organization}</span>
              <span className="text-muted">{formatDateTime(r.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
