export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type ReferralStatus = "ACCEPTED" | "PENDING" | "REJECTED";

export interface PatientDto {
  fullName: string;
  dateOfBirth: string;
}

export interface RequesterDto {
  name: string;
  organization: string;
}

export interface ReferralRequest {
  patient: PatientDto;
  reason: string;
  priority: Priority;
  requester: RequesterDto;
}

export interface ReferralResponse {
  id: string;
  status: ReferralStatus;
  patient: PatientDto;
  reason: string;
  priority: Priority;
  requester: RequesterDto;
  createdAt: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  errors?: FieldError[];
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

async function handleResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = body as ApiError;
    throw err;
  }
  return body as T;
}

export async function createReferral(payload: ReferralRequest): Promise<ReferralResponse> {
  const response = await fetch(`${API_BASE}/referrals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<ReferralResponse>(response);
}

export async function getReferrals(): Promise<ReferralResponse[]> {
  const response = await fetch(`${API_BASE}/referrals`);
  return handleResponse<ReferralResponse[]>(response);
}
