package com.example.projectfinal.service;

import com.example.projectfinal.Entity.Otp;
import com.example.projectfinal.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private JavaMailSender mailSender;
    @Transactional
    public void generateAndSendOtp(String email) {
        otpRepository.deleteByEmail(email);

        Random random = new Random();
        String otpCode = String.format("%06d", random.nextInt(999999));

        Otp otp = Otp.builder()
                .email(email)
                .otpCode(otpCode)
                .expirationTime(LocalDateTime.now().plusMinutes(1))//giá trị thời gian OTP trong 1 phút
                .build();

        otpRepository.save(otp);

        try {
            sendOtpEmail(email, otpCode);
        } catch (MessagingException e) {
            throw new RuntimeException("Gửi email OTP thất bại, vui lòng thử lại sau.");
        }
    }
    @Transactional
    private void sendOtpEmail(String email, String otpCode) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        helper.setTo(email);
        helper.setSubject("Chung Cư IUH : Mã OTP xác thực Tài khoản của bạn");
//        int expirationTimeInSeconds = 60;
        helper.setText(
                "Xin chào,<br>" +
                        "Mã OTP của bạn là: <b>" + otpCode + "</b><br>" +
                        "Vui lòng không chia sẻ mã này.<br>" +
//                        "Mã này sẽ có giá trị trong " + expirationTimeInSeconds + " giây.",
                        "Mã này sẽ có giá trị trong 60 giây.",
                true
        );

        mailSender.send(mimeMessage);
    }
//    @Transactional
//    public boolean verifyOtp(String email, String otpCode) {
//        Otp otp = otpRepository.findByEmailAndOtpCode(email, otpCode).orElse(null);
//
//        if (otp != null && otp.getExpirationTime().isAfter(LocalDateTime.now())) {
//            otpRepository.deleteByEmail(email);
//            return true;
//        }
//        return false;
//    }

    @Transactional
    public boolean verifyOtp(String email, String otpCode) {
        Otp otp = otpRepository.findByEmailAndOtpCode(email, otpCode).orElse(null);

        // Kiểm tra nếu OTP không tồn tại hoặc đã hết hạn
        if (otp == null || otp.getExpirationTime().isBefore(LocalDateTime.now())) {
            // Log nếu OTP không hợp lệ
            System.out.println("OTP không hợp lệ hoặc đã hết hạn cho email: " + email);
            return false;
        }

        // Xóa OTP sau khi xác thực thành công
        otpRepository.deleteByEmail(email);
        return true;
    }
    @Transactional
    public void sendOtpForEmailChange(String oldEmail) {
        generateAndSendOtp(oldEmail);
    }

}
