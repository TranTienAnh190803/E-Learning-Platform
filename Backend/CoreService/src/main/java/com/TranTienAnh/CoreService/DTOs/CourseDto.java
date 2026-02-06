package com.TranTienAnh.CoreService.DTOs;

import com.TranTienAnh.CoreService.Models.Enums.CourseStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.List;

public class CourseDto {
    private Long id;

    private String title;

    private String description;

    private String status;

    private List<String> results;

    private String imageUrl;

    private String instructor;

    public CourseDto() {
    }

    public CourseDto(Long id, String title, String description, String status, List<String> results, String imageUrl, String instructor) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.results = results;
        this.imageUrl = imageUrl;
        this.instructor = instructor;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getResults() {
        return results;
    }

    public void setResults(List<String> results) {
        this.results = results;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }
}
