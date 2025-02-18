package com.example.projectfinal.request.user;

public class VerifyOtpRequest {
    private String oldEmail;
    private String newEmail;
    private String otp;

    // Getter và Setter cho oldEmail
    public String getOldEmail() {
        return oldEmail;
    }

    public void setOldEmail(String oldEmail) {
        this.oldEmail = oldEmail;
    }

    // Getter và Setter cho newEmail
    public String getNewEmail() {
        return newEmail;
    }

    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail;
    }

    // Getter và Setter cho otp
    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
