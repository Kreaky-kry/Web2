package com.luan_nguyen.example205.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.luan_nguyen.example205.service.EmailService;

@RestController
@RequestMapping("/api/auth_email")
@CrossOrigin(origins = "http://localhost:3000")
public class ForgotPasswordController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email không hợp lệ.");
        }
        String otp = emailService.generateOtp();
        emailService.sendOtp(email, otp);
        return ResponseEntity.ok("OTP đã được gửi về email của bạn.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        // Xử lý xác thực OTP nếu lưu trữ OTP (ví dụ trong cache/database)
        return ResponseEntity.ok("Xác thực thành công. Bạn có thể đặt lại mật khẩu.");
    }
}
