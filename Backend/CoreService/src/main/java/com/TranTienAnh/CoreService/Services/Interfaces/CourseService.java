package com.TranTienAnh.CoreService.Services.Interfaces;

import com.TranTienAnh.CoreService.DTOs.CourseDto;
import com.TranTienAnh.CoreService.DTOs.CourseMemberDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Forms.CourseCreateForm;
import com.TranTienAnh.CoreService.Forms.CourseForm;

import java.io.IOException;
import java.util.List;

public interface CourseService {
    Response<Void> addCourse(String email, String token, CourseCreateForm courseForm) throws IOException;

    Response<CourseDto> getCourse(Long courseId);

    Response<List<CourseDto>> getAll();

    Response<Void> updateCourse(String email, Long courseId, CourseForm courseForm) throws IOException;

    Response<Void> deleteCourse(String email, Long courseId, String token);

    Response<List<CourseDto>> getAllOwnedCourses(String email);

    Response<List<Long>> getOwnedCourseId(String email);

    Response<Void> completeUpdateCourse(String email, Long courseId);

    Response<List<CourseMemberDto>> getMemeber(String email, Long courseId);

    Response<Void> kickMember(String email, Long courseId, Long studentId);
}
