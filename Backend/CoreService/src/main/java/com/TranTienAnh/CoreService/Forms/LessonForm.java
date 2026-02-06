package com.TranTienAnh.CoreService.Forms;

import com.TranTienAnh.CoreService.Models.Enums.LessonType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import org.springframework.web.multipart.MultipartFile;

public class LessonForm {
    private String title;

    private LessonType lessonType;

    private String content;

    private MultipartFile videoFile;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LessonType getLessonType() {
        return lessonType;
    }

    public void setLessonType(LessonType lessonType) {
        this.lessonType = lessonType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public MultipartFile getVideoFile() {
        return videoFile;
    }

    public void setVideoFile(MultipartFile videoFile) {
        this.videoFile = videoFile;
    }
}
