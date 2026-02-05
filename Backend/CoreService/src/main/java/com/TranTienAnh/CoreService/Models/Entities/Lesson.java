package com.TranTienAnh.CoreService.Models.Entities;

import com.TranTienAnh.CoreService.Models.Enums.LessonType;
import jakarta.persistence.*;

@Entity
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LessonType lessonType;

    @Column(length = 10000)
    private String content;

    @Column(nullable = true)
    private String contentUrl;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    public Lesson() {
    }

    public Lesson(String title, LessonType lessonType, String content, String contentUrl, Course course) {
        this.title = title;
        this.lessonType = lessonType;
        this.content = content;
        this.contentUrl = contentUrl;
        this.course = course;
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

    public String getContentUrl() {
        return contentUrl;
    }

    public void setContentUrl(String contentUrl) {
        this.contentUrl = contentUrl;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}
