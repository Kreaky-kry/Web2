package com.luan_nguyen.example205.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.luan_nguyen.example205.entity.User;
import com.luan_nguyen.example205.repository.OtpRepository;
import com.luan_nguyen.example205.repository.UserRepository;

import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final MailService mailService;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;

    public void sendPasswordResetCode(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty())
            throw new RuntimeException("Email không tồn tại.");

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpRepository.saveOtp(email, otp);
        mailService.sendResetCode(email, otp);
    }

    public void resetPassword(String email, String otp, String newPassword) {
        String savedOtp = otpRepository.getOtp(email);
        if (savedOtp == null || !savedOtp.equals(otp)) {
            throw new RuntimeException("Mã OTP không hợp lệ hoặc đã hết hạn.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng."));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otpRepository.removeOtp(email);
    }
}