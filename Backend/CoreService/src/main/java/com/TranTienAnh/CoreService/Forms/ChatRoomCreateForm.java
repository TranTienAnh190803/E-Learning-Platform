package com.TranTienAnh.CoreService.Forms;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatRoomCreateForm extends ChatRoomForm{
    private String title;

    public ChatRoomCreateForm() {
    }

    public ChatRoomCreateForm(Long courseId, String email, String fullname, Long userId, String title) {
        super(courseId, email, fullname, userId);
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
