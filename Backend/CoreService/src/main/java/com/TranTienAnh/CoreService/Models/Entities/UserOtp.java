package com.TranTienAnh.CoreService.Models.Entities;

import com.TranTienAnh.CoreService.Models.Enums.OtpPurpose;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class UserOtp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String otpCode;

    @Column(nullable = false)
    private LocalDateTime expiredTime;

    @Column(nullable = false)
    private OtpPurpose purpose;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public UserOtp() {
    }

    public UserOtp(String otpCode, LocalDateTime expiredTime, OtpPurpose purpose, User user) {
        this.otpCode = otpCode;
        this.expiredTime = expiredTime;
        this.purpose = purpose;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public LocalDateTime getExpiredTime() {
        return expiredTime;
    }

    public void setExpiredTime(LocalDateTime expiredTime) {
        this.expiredTime = expiredTime;
    }

    public OtpPurpose getPurpose() {
        return purpose;
    }

    public void setPurpose(OtpPurpose purpose) {
        this.purpose = purpose;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
