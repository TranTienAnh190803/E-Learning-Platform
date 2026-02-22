package com.TranTienAnh.CoreService.Models.Entities;

import com.TranTienAnh.CoreService.Models.EmbeddedId.LearningProcessId;
import jakarta.persistence.*;

@Entity
public class LearningProcess {
    @EmbeddedId
    private LearningProcessId id;

    @ManyToOne
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @MapsId("courseId")
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @MapsId("lessonId")
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    public LearningProcess() {
    }

    public LearningProcess(User student, Course course, Lesson lesson) {
        this.id = new LearningProcessId(student.getId(), course.getId(), lesson.getId());
        this.student = student;
        this.course = course;
        this.lesson = lesson;
    }

    public LearningProcessId getId() {
        return id;
    }

    public void setId(LearningProcessId id) {
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

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }
}
