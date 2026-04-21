package com.example.referrals.model

import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Past
import jakarta.validation.constraints.Size
import java.time.Instant
import java.time.LocalDate

enum class Priority {
    LOW, MEDIUM, HIGH
}

enum class ReferralStatus {
    ACCEPTED, PENDING, REJECTED
}

data class PatientDto(
    @field:NotBlank(message = "Patient full name is required")
    @field:Size(min = 2, max = 100, message = "Patient full name must be between 2 and 100 characters")
    val fullName: String,

    @field:NotNull(message = "Date of birth is required")
    @field:Past(message = "Date of birth must be a date in the past")
    val dateOfBirth: LocalDate
)

data class RequesterDto(
    @field:NotBlank(message = "Requester name is required")
    @field:Size(max = 100, message = "Requester name must not exceed 100 characters")
    val name: String,

    @field:NotBlank(message = "Requester organization is required")
    @field:Size(max = 200, message = "Organization name must not exceed 200 characters")
    val organization: String
)

data class ReferralRequest(
    @field:Valid
    @field:NotNull(message = "Patient details are required")
    val patient: PatientDto,

    @field:NotBlank(message = "Referral reason is required")
    @field:Size(min = 10, max = 2000, message = "Referral reason must be between 10 and 2000 characters")
    val reason: String,

    @field:NotNull(message = "Priority is required")
    val priority: Priority,

    @field:Valid
    @field:NotNull(message = "Requester details are required")
    val requester: RequesterDto
)

data class ReferralResponse(
    val id: String,
    val status: ReferralStatus,
    val patient: PatientDto,
    val reason: String,
    val priority: Priority,
    val requester: RequesterDto,
    val createdAt: Instant
)
