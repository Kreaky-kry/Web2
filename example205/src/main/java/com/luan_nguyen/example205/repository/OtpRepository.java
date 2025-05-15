package com.luan_nguyen.example205.repository;

import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class OtpRepository {
    private final Map<String, String> otpMap = new ConcurrentHashMap<>();

    public void saveOtp(String email, String otp) {
        otpMap.put(email, otp);
    }

    public String getOtp(String email) {
        return otpMap.get(email);
    }

    public void removeOtp(String email) {
        otpMap.remove(email);
    }
}