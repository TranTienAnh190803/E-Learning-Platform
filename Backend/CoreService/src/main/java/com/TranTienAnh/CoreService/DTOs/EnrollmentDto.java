package com.TranTienAnh.CoreService.DTOs;

import jakarta.persistence.Column;
import org.hibernate.annotations.Check;

import java.time.LocalDateTime;
import java.util.List;

public class EnrollmentDto extends CourseDto{
    private LocalDateTime enrollAt;

    private int completedStatus;

    public EnrollmentDto(Long id, String title, String description, String status, List<String> results, String imageUrl, String instructor, Boolean isPublic, LocalDateTime enrollAt, int completedStatus) {
        super(id, title, description, status, results, imageUrl, instructor, isPublic);
        this.enrollAt = enrollAt;
        this.completedStatus = completedStatus;
    }

    public LocalDateTime getEnrollAt() {
        return enrollAt;
    }

    public void setEnrollAt(LocalDateTime enrollAt) {
        this.enrollAt = enrollAt;
    }

    public int getCompletedStatus() {
        return completedStatus;
    }

    public void setCompletedStatus(int status) {
        this.completedStatus = status;
    }
}
