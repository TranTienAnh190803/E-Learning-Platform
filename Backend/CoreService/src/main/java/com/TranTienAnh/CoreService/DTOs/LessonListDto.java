package com.TranTienAnh.CoreService.DTOs;

import java.time.LocalDateTime;

public class LessonListDto {
    private Long id;

    private String title;

    private LocalDateTime addedDate;

    public LessonListDto() {
    }

    public LessonListDto(Long id, String title, LocalDateTime addedDate) {
        this.id = id;
        this.title = title;
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

    public LocalDateTime getAddedDate() {
        return addedDate;
    }

    public void setAddedDate(LocalDateTime addedDate) {
        this.addedDate = addedDate;
    }
}
