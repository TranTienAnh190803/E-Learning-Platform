package com.TranTienAnh.CoreService.Forms;

import java.util.List;

public class NotificationForm {
    private Long courseId;

    private int type;

    private String title;

    private String content;

    private String contentId;

    private List<Long> receivers;

    public NotificationForm() {
    }

    public NotificationForm(Long courseId, int type, String title, String content, String contentId, List<Long> receivers) {
        this.courseId = courseId;
        this.type = type;
        this.title = title;
        this.content = content;
        this.contentId = contentId;
        this.receivers = receivers;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContentId() {
        return contentId;
    }

    public void setContentId(String contentId) {
        this.contentId = contentId;
    }

    public List<Long> getReceivers() {
        return receivers;
    }

    public void setReceivers(List<Long> receivers) {
        this.receivers = receivers;
    }
}
