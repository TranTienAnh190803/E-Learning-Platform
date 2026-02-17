package com.TranTienAnh.CoreService.DTOs;

import com.TranTienAnh.CoreService.Models.Enums.LessonType;
import jakarta.persistence.Column;

import java.time.LocalDateTime;

public class LessonDto {
    private Long id;

    private String title;

    private String lessonType;

    private String content;

    private String contentUrl;

    private LocalDateTime addedDate;

    public LessonDto() {
    }

    public LessonDto(Long id, String title, String lessonType, String content, String contentUrl, LocalDateTime addedDate) {
        this.id = id;
        this.title = title;
        this.lessonType = lessonType;
        this.content = content;
        this.contentUrl = contentUrl;
        this.addedDate = addedDate;
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

    public LocalDateTime getAddedDate() {
        return addedDate;
    }

    public void setAddedDate(LocalDateTime addedDate) {
        this.addedDate = addedDate;
    }
}
