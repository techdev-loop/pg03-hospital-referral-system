package com.example.referrals.controller

import com.example.referrals.model.ReferralRequest
import com.example.referrals.model.ReferralResponse
import com.example.referrals.service.ReferralService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/referrals")
@CrossOrigin(origins = ["*"])
class ReferralController(
    private val referralService: ReferralService
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createReferral(@Valid @RequestBody request: ReferralRequest): ReferralResponse {
        return referralService.createReferral(request)
    }

    @GetMapping
    fun getAllReferrals(): List<ReferralResponse> {
        return referralService.getAllReferrals()
    }

    @GetMapping("/{id}")
    fun getReferralById(@PathVariable id: String): ResponseEntity<ReferralResponse> {
        val referral = referralService.getReferralById(id)
        return if (referral != null) ResponseEntity.ok(referral)
        else ResponseEntity.notFound().build()
    }
}
