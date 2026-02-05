package com.TranTienAnh.CoreService.Models.Entities;

import com.TranTienAnh.CoreService.Models.EmbeddedId.EnrollmentId;
import jakarta.persistence.*;
import org.hibernate.annotations.Check;

import java.time.LocalDateTime;

@Entity
public class Enrollment {
    @EmbeddedId
    private EnrollmentId id;

    @ManyToOne
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @MapsId("courseId")
    @JoinColumn(name = "course_id")
    private Course course;

    private LocalDateTime enrollAt;

    @Column(nullable = false)
    @Check(constraints = "status >= 0 AND status <= 100")
    private int status;

    public Enrollment() {
    }

    public Enrollment(User student, Course course, LocalDateTime enrollAt, int status) {
        this.student = student;
        this.course = course;
        this.enrollAt = enrollAt;
        this.status = status;
    }

    public EnrollmentId getId() {
        return id;
    }

    public void setId(EnrollmentId id) {
        this.id = id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public LocalDateTime getEnrollAt() {
        return enrollAt;
    }

    public void setEnrollAt(LocalDateTime enrollAt) {
        this.enrollAt = enrollAt;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
