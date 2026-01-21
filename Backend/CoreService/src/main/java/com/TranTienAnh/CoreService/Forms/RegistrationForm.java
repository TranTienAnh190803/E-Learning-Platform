package com.TranTienAnh.CoreService.Forms;

import com.TranTienAnh.CoreService.Models.Enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;

import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RegistrationForm {
    private String fullName;

    private Date dateOfBirth;

    private String address;

    private String email;

    private String password;

    private String reEnteredPassword;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getReEnteredPassword() {
        return reEnteredPassword;
    }

    public void setReEnteredPassword(String reEnteredPassword) {
        this.reEnteredPassword = reEnteredPassword;
    }
}
