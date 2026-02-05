package com.TranTienAnh.CoreService.Models.Entities;

import com.TranTienAnh.CoreService.Models.Enums.CourseStatus;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private CourseStatus status;

    @ElementCollection
    @CollectionTable(
            name = "course_result",
            joinColumns = @JoinColumn(name = "course_id")
    )
    @Column(name = "result")
    private List<String> results;

    @Column(nullable = true)
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private User Instructor;

    @OneToMany(mappedBy = "course")
    private List<Lesson> lesson;

    public Course() {
    }

    public Course(String title, String description, CourseStatus status, List<String> results, String imageUrl, User instructor) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.results = results;
        this.imageUrl = imageUrl;
        Instructor = instructor;
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

    public List<String> getResult() {
        return results;
    }

    public void setResult(List<String> result) {
        this.results = result;
    }

    public User getInstructor() {
        return Instructor;
    }

    public void setInstructor(User instructor) {
        Instructor = instructor;
    }

    public CourseStatus getStatus() {
        return status;
    }

    public void setStatus(CourseStatus status) {
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
}
