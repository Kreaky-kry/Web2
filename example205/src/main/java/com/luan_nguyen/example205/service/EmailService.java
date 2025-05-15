package com.luan_nguyen.example205.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtp(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã OTP xác nhận quên mật khẩu");
        message.setText("Mã OTP của bạn là: " + otpCode);
        mailSender.send(message);
    }

    public String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}
