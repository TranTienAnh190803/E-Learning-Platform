package com.TranTienAnh.CoreService.DTOs;

import com.TranTienAnh.CoreService.Models.Enums.Role;
import jakarta.persistence.Column;

import java.time.LocalDate;

public class UserDto {
    private Long id;

    private String fullName;

    private LocalDate dateOfBirth;

    private String address;

    private String role;

    private String email;

    // Constructor
    public UserDto(Long id, String fullName, LocalDate dateOfBirth, String address, String role, String email) {
        this.id = id;
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.role = role;
        this.email = email;
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
}
