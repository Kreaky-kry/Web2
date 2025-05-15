package com.luan_nguyen.example205.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.luan_nguyen.example205.entity.OtpToken;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findByEmailAndOtp(String email, String otp);

    void deleteByExpirationTimeBefore(LocalDateTime now);
}