package com.example.referrals.model

import jakarta.persistence.*
import java.time.Instant
import java.time.LocalDate

@Entity
@Table(name = "referrals")
class ReferralEntity(

    @Id
    val id: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: ReferralStatus,

    @Column(name = "patient_full_name", nullable = false)
    val patientFullName: String,

    @Column(name = "patient_date_of_birth", nullable = false)
    val patientDateOfBirth: LocalDate,

    @Column(nullable = false, columnDefinition = "TEXT")
    val reason: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val priority: Priority,

    @Column(name = "requester_name", nullable = false)
    val requesterName: String,

    @Column(name = "requester_organization", nullable = false)
    val requesterOrganization: String,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now()
) {
    fun toResponse() = ReferralResponse(
        id = id,
        status = status,
        patient = PatientDto(fullName = patientFullName, dateOfBirth = patientDateOfBirth),
        reason = reason,
        priority = priority,
        requester = RequesterDto(name = requesterName, organization = requesterOrganization),
        createdAt = createdAt
    )
}
