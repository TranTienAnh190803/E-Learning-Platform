package com.TranTienAnh.CoreService.Controllers;

import com.TranTienAnh.CoreService.DTOs.EnrollmentDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Services.Interfaces.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("enrollment-api")
public class EnrollmentController {
    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping("enroll-course/{courseId}/{password}")
    public ResponseEntity<Response<Void>> enrollCourse(@PathVariable("courseId") Long courseId, @PathVariable("password") String password) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();
        Response<Void> response = enrollmentService.enrollCourse(courseId, password, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("get-enrolled-courses")
    public ResponseEntity<Response<List<EnrollmentDto>>> getEnrolledCourses() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();
        Response<List<EnrollmentDto>> response = enrollmentService.getEnrolledCourse(email);
        return ResponseEntity.ok(response);
    }
}
