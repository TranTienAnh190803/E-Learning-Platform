package com.TranTienAnh.CoreService.DTOs;

import com.TranTienAnh.CoreService.Models.Enums.LessonType;
import jakarta.persistence.Column;

public class LessonDto {
    private Long id;

    private String title;

    private String lessonType;

    private String content;

    private String contentUrl;

    public LessonDto() {
    }

    public LessonDto(Long id, String title, String lessonType, String content, String contentUrl) {
        this.id = id;
        this.title = title;
        this.lessonType = lessonType;
        this.content = content;
        this.contentUrl = contentUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLessonType() {
        return lessonType;
    }

    public void setLessonType(String lessonType) {
        this.lessonType = lessonType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContentUrl() {
        return contentUrl;
    }

    public void setContentUrl(String contentUrl) {
        this.contentUrl = contentUrl;
    }
}
