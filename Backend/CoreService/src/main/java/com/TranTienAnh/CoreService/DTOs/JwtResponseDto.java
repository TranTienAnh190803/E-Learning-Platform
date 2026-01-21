package com.TranTienAnh.CoreService.DTOs;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class JwtResponseDto {
    private String role;

    private String token;

    public JwtResponseDto(String role, String token) {
        this.role = role;
        this.token = token;
    }

    // Getter & Setter
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
