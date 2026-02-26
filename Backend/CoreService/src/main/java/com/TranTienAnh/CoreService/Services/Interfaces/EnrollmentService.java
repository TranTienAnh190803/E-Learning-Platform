package com.TranTienAnh.CoreService.Services.Interfaces;

import com.TranTienAnh.CoreService.DTOs.EnrollmentDto;
import com.TranTienAnh.CoreService.DTOs.Response;

import java.util.List;

public interface EnrollmentService {
    Response<Void> enrollCourse(Long courseId, String password, String email, String token);

    Response<List<EnrollmentDto>> getEnrolledCourse(String email);

    Response<List<?>> getCourseForSocket(String email);

    Response<Void> updateProcess(Long courseId, Long lessonId, String email);

    Response<Void> leaveCourse(Long courseId, String email, String token);

    Response<List<Long>> getCompletedLesson(Long courseId, String email);
}
