package com.TranTienAnh.CoreService.Forms;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PasswordChangingForm {
    private String newPassword;

    private String reEnteredPassword;

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getReEnteredPassword() {
        return reEnteredPassword;
    }

    public void setReEnteredPassword(String reEnteredPassword) {
        this.reEnteredPassword = reEnteredPassword;
    }
}
