package com.TranTienAnh.CoreService.Controllers;

import com.TranTienAnh.CoreService.DTOs.CourseDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Forms.CourseCreateForm;
import com.TranTienAnh.CoreService.Forms.CourseForm;
import com.TranTienAnh.CoreService.Services.Interfaces.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("course-api")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @PostMapping(value = "add-course", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response<Void>> addCourse(@ModelAttribute CourseCreateForm courseForm) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();
        Response<Void> response = courseService.addCourse(email, courseForm);
        return ResponseEntity.ok(response);
    }

    @GetMapping("public/get-course/{courseId}")
    public ResponseEntity<Response<CourseDto>> getCourse(@PathVariable("courseId") Long courseId) {
        Response<CourseDto> response = courseService.getCourse(courseId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("public/get-all")
    public ResponseEntity<Response<List<CourseDto>>> getAll() {
        Response<List<CourseDto>> response = courseService.getAll();
        return ResponseEntity.ok(response);
    }

    @PatchMapping(value = "update-course/{courseId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response<Void>> updateCourse(@PathVariable("courseId") Long courseId, @ModelAttribute CourseForm courseForm) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();
        Response<Void> response = courseService.updateCourse(email, courseId, courseForm);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("delete-course/{courseId}")
    public ResponseEntity<Response<Void>> deleteCourse(@PathVariable("courseId") Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();
        String token = (String) authentication.getDetails();
        Response<Void> response = courseService.deleteCourse(email, courseId, token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("get-all-owned-courses")
    public ResponseEntity<Response<List<CourseDto>>> getAllOwnedCourse() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();
        Response<List<CourseDto>> response = courseService.getAllOwnedCourses(email);
        return ResponseEntity.ok(response);
    }
}
