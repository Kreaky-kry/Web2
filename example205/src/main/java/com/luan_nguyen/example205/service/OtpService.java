package com.luan_nguyen.example205.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.luan_nguyen.example205.entity.OtpToken;
import com.luan_nguyen.example205.repository.OtpTokenRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpTokenRepository otpTokenRepository;

    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));

        OtpToken otpToken = new OtpToken();
        otpToken.setEmail(email);
        otpToken.setOtp(otp);
        otpToken.setExpirationTime(LocalDateTime.now().plusMinutes(5)); // OTP hết hạn sau 5 phút
        otpTokenRepository.save(otpToken);

        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        Optional<OtpToken> token = otpTokenRepository.findByEmailAndOtp(email, otp);
        return token.isPresent() && token.get().getExpirationTime().isAfter(LocalDateTime.now());
    }

    // Xóa các OTP hết hạn mỗi 1 phút
    @Scheduled(fixedRate = 60000)
    public void cleanUpExpiredOtps() {
        otpTokenRepository.deleteByExpirationTimeBefore(LocalDateTime.now());
    }
}
