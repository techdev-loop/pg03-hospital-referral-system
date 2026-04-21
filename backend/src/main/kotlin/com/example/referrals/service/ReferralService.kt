package com.example.referrals.service

import com.example.referrals.model.ReferralEntity
import com.example.referrals.model.ReferralRequest
import com.example.referrals.model.ReferralResponse
import com.example.referrals.model.ReferralStatus
import com.example.referrals.repository.ReferralRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.UUID

@Service
class ReferralService(
    private val referralRepository: ReferralRepository
) {
    private val log = LoggerFactory.getLogger(ReferralService::class.java)

    fun createReferral(request: ReferralRequest): ReferralResponse {
        val id = "ref_${UUID.randomUUID().toString().replace("-", "").take(8)}"
        val entity = ReferralEntity(
            id = id,
            status = ReferralStatus.ACCEPTED,
            patientFullName = request.patient.fullName,
            patientDateOfBirth = request.patient.dateOfBirth,
            reason = request.reason,
            priority = request.priority,
            requesterName = request.requester.name,
            requesterOrganization = request.requester.organization,
            createdAt = Instant.now()
        )
        val saved = referralRepository.save(entity)
        log.info("Referral persisted: id={} priority={} patient={}", id, request.priority, request.patient.fullName)
        return saved.toResponse()
    }

    fun getAllReferrals(): List<ReferralResponse> =
        referralRepository.findAll().map { it.toResponse() }

    fun getReferralById(id: String): ReferralResponse? =
        referralRepository.findById(id).orElse(null)?.toResponse()
}
