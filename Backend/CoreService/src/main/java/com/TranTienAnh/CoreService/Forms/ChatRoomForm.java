package com.TranTienAnh.CoreService.Forms;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatRoomForm {
    private Long courseId;

    private String email;

    private String fullname;

    private Long userId;

    public ChatRoomForm() {
    }

    public ChatRoomForm(Long courseId, String email, String fullname, Long userId) {
        this.courseId = courseId;
        this.email = email;
        this.fullname = fullname;
        this.userId = userId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
