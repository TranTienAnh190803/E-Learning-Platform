package com.TranTienAnh.CoreService.Models.EmbeddedId;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class LearningProcessId implements Serializable {
    private Long studentId;

    private Long courseId;

    private Long lessonId;

    public LearningProcessId() {
    }

    public LearningProcessId(Long studentId, Long courseId, Long lessonId) {
        this.studentId = studentId;
        this.courseId = courseId;
        this.lessonId = lessonId;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        LearningProcessId that = (LearningProcessId) o;
        return Objects.equals(studentId, that.studentId) && Objects.equals(courseId, that.courseId) && Objects.equals(lessonId, that.lessonId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId, courseId, lessonId);
    }
}
