package com.example.referrals.repository

import com.example.referrals.model.ReferralEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ReferralRepository : JpaRepository<ReferralEntity, String>
