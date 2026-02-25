package com.TranTienAnh.CoreService.DTOs;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CourseMemberDto {
    private Long studentId;

    private String fullName;

    private String email;

    private String avatarUrl;

    public CourseMemberDto() {
    }

    public CourseMemberDto(Long studentId, String fullName, String email, String avatarUrl) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
