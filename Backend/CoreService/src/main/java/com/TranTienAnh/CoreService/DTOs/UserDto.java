package com.TranTienAnh.CoreService.DTOs;

import com.TranTienAnh.CoreService.Models.Enums.Role;
import jakarta.persistence.Column;

import java.time.LocalDate;

public class UserDto {
    private Long id;

    private String fullName;

    private Boolean gender;

    private LocalDate dateOfBirth;

    private String address;

    private String role;

    private String email;

    private String status;

    private int statusNumber;

    // Constructor


    public UserDto(Long id, String fullName, Boolean gender, LocalDate dateOfBirth, String address, String role, String email, String status, int statusNumber) {
        this.id = id;
        this.fullName = fullName;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.role = role;
        this.email = email;
        this.status = status;
        this.statusNumber = statusNumber;
    }

    // Getter & Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getGender() {
        return gender;
    }

    public void setGender(Boolean gender) {
        this.gender = gender;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getStatusNumber() {
        return statusNumber;
    }

    public void setStatusNumber(int statusNumber) {
        this.statusNumber = statusNumber;
    }
}
