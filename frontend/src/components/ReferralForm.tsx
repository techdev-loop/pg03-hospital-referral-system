import { FormEvent, useState } from "react";
import { createReferral, ApiError, Priority, ReferralResponse } from "../api";

interface Props {
  onSuccess: (referral: ReferralResponse) => void;
}

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: "LOW", label: "Low", color: "priority-low" },
  { value: "MEDIUM", label: "Medium", color: "priority-medium" },
  { value: "HIGH", label: "High", color: "priority-high" },
];

function formatFieldName(field: string): string {
  return field
    .replace("patient.", "Patient → ")
    .replace("requester.", "Requester → ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export default function ReferralForm({ onSuccess }: Props) {
  const [patientName, setPatientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [requesterName, setRequesterName] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const today = new Date().toISOString().split("T")[0];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(null);
    setLoading(true);

    try {
      const result = await createReferral({
        patient: { fullName: patientName, dateOfBirth },
        reason,
        priority,
        requester: { name: requesterName, organization },
      });
      onSuccess(result);
      setPatientName("");
      setDateOfBirth("");
      setReason("");
      setPriority("MEDIUM");
      setRequesterName("");
      setOrganization("");
    } catch (err) {
      setApiError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="referral-form" onSubmit={onSubmit} noValidate>
      <fieldset>
        <legend>Patient Information</legend>
        <div className="form-row">
          <div className="field">
            <label htmlFor="patientName">Full Name *</label>
            <input
              id="patientName"
              type="text"
              placeholder="Jane Doe"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="dob">Date of Birth *</label>
            <input
              id="dob"
              type="date"
              max={today}
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Referral Details</legend>
        <div className="field">
          <label htmlFor="reason">Referral Reason *</label>
          <textarea
            id="reason"
            rows={4}
            placeholder="Describe the clinical reason for this referral (minimum 10 characters)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            minLength={10}
          />
          <span className="char-count">{reason.length} / 2000</span>
        </div>

        <div className="field">
          <label>Priority *</label>
          <div className="priority-group">
            {PRIORITIES.map(({ value, label, color }) => (
              <label key={value} className={`priority-option ${color} ${priority === value ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="priority"
                  value={value}
                  checked={priority === value}
                  onChange={() => setPriority(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Referring Clinician</legend>
        <div className="form-row">
          <div className="field">
            <label htmlFor="reqName">Clinician Name *</label>
            <input
              id="reqName"
              type="text"
              placeholder="Dr. Smith"
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="org">Organization *</label>
            <input
              id="org"
              type="text"
              placeholder="City General Hospital"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
            />
          </div>
        </div>
      </fieldset>

      {apiError && (
        <div className="alert alert-error" role="alert">
          <strong>{apiError.message}</strong>
          {apiError.errors && apiError.errors.length > 0 && (
            <ul>
              {apiError.errors.map((e, i) => (
                <li key={i}>{formatFieldName(e.field)}: {e.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? (
          <span className="loading-text">
            <span className="spinner" />
            Submitting...
          </span>
        ) : (
          "Submit Referral"
        )}
      </button>
    </form>
  );
}
