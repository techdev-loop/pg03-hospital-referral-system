package com.example.referrals.service

import com.example.referrals.model.ReferralRequest
import com.example.referrals.model.ReferralResponse
import com.example.referrals.model.ReferralStatus
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

@Service
class ReferralService {

    private val log = LoggerFactory.getLogger(ReferralService::class.java)
    private val store = ConcurrentHashMap<String, ReferralResponse>()

    fun createReferral(request: ReferralRequest): ReferralResponse {
        val id = "ref_${UUID.randomUUID().toString().replace("-", "").take(8)}"
        val referral = ReferralResponse(
            id = id,
            status = ReferralStatus.ACCEPTED,
            patient = request.patient,
            reason = request.reason,
            priority = request.priority,
            requester = request.requester,
            createdAt = Instant.now()
        )
        store[id] = referral
        log.info("Referral created: id={} priority={} patient={}", id, request.priority, request.patient.fullName)
        return referral
    }

    fun getAllReferrals(): List<ReferralResponse> = store.values.toList()

    fun getReferralById(id: String): ReferralResponse? = store[id]
}
