package com.TranTienAnh.CoreService.Forms;

import com.TranTienAnh.CoreService.Models.Enums.CourseStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class CourseForm {
    private String title;

    private String description;

    private List<String> results;

    private MultipartFile image;

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

    public List<String> getResults() {
        return results;
    }

    public void setResults(List<String> results) {
        this.results = results;
    }

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }
}
