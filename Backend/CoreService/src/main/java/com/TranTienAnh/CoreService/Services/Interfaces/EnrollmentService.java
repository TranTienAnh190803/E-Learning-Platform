package com.TranTienAnh.CoreService.Services.Interfaces;

import com.TranTienAnh.CoreService.DTOs.Response;

public interface EnrollmentService {
    Response<Void> enrollCourse(Long courseId, String password, String email);
}
