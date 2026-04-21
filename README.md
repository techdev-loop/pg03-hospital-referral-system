# PG-03 Hospital Referral System

A full-stack hospital referral management application built with **Kotlin + Spring Boot** (backend) and **React + TypeScript** (frontend), containerised with Docker Compose.

---

## Quick Start

```bash
docker compose up --build
```

| Service  | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:3000    |
| Backend  | http://localhost:8080    |

Login with any email and any password (authentication is mocked — see [Assumptions](#assumptions)).

---

## Project Structure

```
pg03-referrals/
├── backend/                    # Kotlin + Spring Boot REST API
│   ├── src/main/kotlin/...
│   │   ├── ReferralApplication.kt
│   │   ├── controller/         # REST endpoints
│   │   ├── service/            # Business logic & in-memory store
│   │   ├── model/              # DTOs and enums
│   │   └── exception/          # Global error handling
│   ├── build.gradle.kts
│   └── Dockerfile
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/              # LoginPage, DashboardPage
│   │   ├── components/         # ReferralForm, ReferralList
│   │   ├── api.ts              # Typed fetch client
│   │   └── styles.css
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Architecture Overview

```
Browser (React SPA)
    │
    │  POST /referrals
    │  GET  /referrals
    ▼
Spring Boot REST API (port 8080)
    │
    ▼
In-Memory Store (ConcurrentHashMap)
```

The frontend is a single-page app served by Nginx. It communicates directly with the Spring Boot API. Referrals are stored in-memory for simplicity (see [Assumptions](#assumptions)).

---

## API Reference

### `POST /referrals`

Creates a new referral.

**Request body:**
```json
{
  "patient": {
    "fullName": "Jane Doe",
    "dateOfBirth": "1990-05-10"
  },
  "reason": "Chest pain, needs cardiology specialist review.",
  "priority": "HIGH",
  "requester": {
    "name": "Dr Smith",
    "organization": "City General Hospital"
  }
}
```

**Response `201 Created`:**
```json
{
  "id": "ref_8f3d1c4a",
  "status": "ACCEPTED",
  "patient": { "fullName": "Jane Doe", "dateOfBirth": "1990-05-10" },
  "reason": "Chest pain, needs cardiology specialist review.",
  "priority": "HIGH",
  "requester": { "name": "Dr Smith", "organization": "City General Hospital" },
  "createdAt": "2026-04-21T10:15:30Z"
}
```

**Validation errors `400 Bad Request`:**
```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "patient.fullName", "message": "Patient full name is required" }
  ]
}
```

### `GET /referrals`

Returns all referrals submitted in the current session.

### `GET /referrals/{id}`

Returns a single referral by ID, or `404` if not found.

---

## Referral Data Model

The referral structure is designed to be **FHIR-aligned** for interoperability with external healthcare systems.

| Field                   | Maps to FHIR concept                     | Notes                              |
|-------------------------|------------------------------------------|------------------------------------|
| `id`                    | `ServiceRequest.id`                      | Auto-generated `ref_` prefixed UUID |
| `status`                | `ServiceRequest.status`                  | `ACCEPTED` / `PENDING` / `REJECTED` |
| `priority`              | `ServiceRequest.priority`                | `LOW` / `MEDIUM` / `HIGH`          |
| `reason`                | `ServiceRequest.reasonCode.text`         | Free-text clinical reason          |
| `patient.fullName`      | `Patient.name.text`                      |                                    |
| `patient.dateOfBirth`   | `Patient.birthDate`                      | ISO 8601 date                      |
| `requester.name`        | `ServiceRequest.requester` → `Practitioner.name` |                           |
| `requester.organization`| `ServiceRequest.requester` → `Organization.name` |                           |
| `createdAt`             | `ServiceRequest.authoredOn`              | UTC ISO 8601 timestamp             |

This means the payload can be mechanically transformed into a valid FHIR `ServiceRequest` resource with minimal mapping effort.

---

## Validation Rules

| Field                | Rule                                   |
|----------------------|----------------------------------------|
| `patient.fullName`   | Required, 2–100 characters             |
| `patient.dateOfBirth`| Required, must be in the past          |
| `reason`             | Required, 10–2000 characters           |
| `priority`           | Required, one of `LOW / MEDIUM / HIGH` |
| `requester.name`     | Required, max 100 characters           |
| `requester.organization` | Required, max 200 characters       |

---

## Database

Referrals are persisted to **Neon (PostgreSQL 17)** via Spring Data JPA.

Schema (auto-created via Neon MCP, managed with `ddl-auto: none`):

```sql
CREATE TABLE referrals (
  id                     VARCHAR(20) PRIMARY KEY,
  status                 VARCHAR(20) NOT NULL,
  patient_full_name      VARCHAR(100) NOT NULL,
  patient_date_of_birth  DATE NOT NULL,
  reason                 TEXT NOT NULL,
  priority               VARCHAR(10) NOT NULL,
  requester_name         VARCHAR(100) NOT NULL,
  requester_organization VARCHAR(200) NOT NULL,
  created_at             TIMESTAMPTZ NOT NULL
);
```

To run locally with PostgreSQL, set these environment variables before `docker compose up`:

```bash
export DATABASE_URL=jdbc:postgresql://<host>/<db>?sslmode=require
export DATABASE_USERNAME=<user>
export DATABASE_PASSWORD=<password>
```

---

## Assumptions

1. **Authentication is mocked.** The login page stores a flag in `localStorage` and navigates to the dashboard. No real session/token management is implemented. In production, this would be replaced with OAuth2 / JWT.

2. **Requester details are manual fields.** In a real system, the requester would be derived from the authenticated user's profile.

3. **CORS is fully open** (`*`) for local development. In production, this would be scoped to the frontend origin.

4. **No HTTPS locally.** This is a local development setup. Production deployments use TLS via Render/Vercel.

---

## Future Improvements

- **Real authentication** — OAuth2 / JWT via Spring Security
- **Async event pipeline** — Publish `ReferralCreated` events to RabbitMQ/Kafka; a worker service transforms and pushes to a FHIR server (e.g. HAPI FHIR)
- **Full FHIR resource serialisation** — Use the HAPI FHIR client library to emit proper `ServiceRequest` bundles
- **Unit & integration tests** — Spring Boot test slice + React Testing Library
- **Audit trail** — Immutable log of all status changes per referral
