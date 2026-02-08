package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.DTOs.CourseDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Exceptions.CustomBadRequestException;
import com.TranTienAnh.CoreService.Exceptions.CustomNotFoundException;
import com.TranTienAnh.CoreService.Forms.CourseForm;
import com.TranTienAnh.CoreService.Models.Entities.Course;
import com.TranTienAnh.CoreService.Models.Enums.CourseStatus;
import com.TranTienAnh.CoreService.Repositories.CourseRepository;
import com.TranTienAnh.CoreService.Repositories.UserRepository;
import com.TranTienAnh.CoreService.Services.Interfaces.CourseService;
import com.TranTienAnh.CoreService.Services.Interfaces.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR')")
    @Transactional
    public Response<Void> addCourse(String email, CourseForm courseForm) throws IOException {
        Response<Void> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found"));

        String password = null;
        if (!courseForm.isPublic())
            password = passwordEncoder.encode(courseForm.getPassword());

        Course course = new Course(
                courseForm.getTitle(),
                courseForm.getDescription(),
                CourseStatus.New,
                courseForm.getResults(),
                courseForm.isPublic(),
                password,
                user
        );
        var newCourse = courseRepository.save(course);

        String image = null;
        if (courseForm.getImage() != null) {
            image = fileService.saveImage(courseForm.getImage(), newCourse.getId(), "course");
            newCourse.setImageUrl(image);
            courseRepository.save(newCourse);
        }

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setMessage("Added course successfully.");

        return response;
    }

    @Override
    public Response<CourseDto> getCourse(Long courseId) {
        Response<CourseDto> response = new Response<>();

        var course = courseRepository.findById(courseId).orElseThrow(() -> new CustomNotFoundException("Course not found."));
        CourseDto dto = new CourseDto(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getStatus().name(),
                course.getResults(),
                course.getImageUrl(),
                course.getInstructor().getFullName()
        );

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setData(dto);

        return response;
    }

    @Override
    public Response<List<CourseDto>> getAll() {
        Response<List<CourseDto>> response = new Response<>();

        var courseList = courseRepository.findAll()
                .stream()
                .map((c) -> new CourseDto(c.getId(), c.getTitle(), c.getDescription(), c.getStatus().name(), c.getResults(), c.getImageUrl(), c.getInstructor().getFullName()))
                .toList();

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setData(courseList);

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR')")
    public Response<Void> updateCourse(String email, Long courseId, CourseForm courseForm) throws IOException {
        Response<Void> response = new Response<>();

        var instructor = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var course = courseRepository.findByIdAndInstructorId(courseId, instructor.getId()).orElseThrow(() -> new CustomNotFoundException("Course not found."));

        if (courseForm.getImage() != null) {
            String image = fileService.saveImage(courseForm.getImage(), instructor.getId(), "course");
            course.setImageUrl(image);
        }

        if (courseForm.isPublic())
            course.setPassword(null);
        else
            course.setPassword(passwordEncoder.encode(courseForm.getPassword()));

        course.setTitle(courseForm.getTitle());
        course.setDescription(courseForm.getDescription());
        course.setResults(courseForm.getResults());
        course.setStatus(CourseStatus.Update);
        courseRepository.save(course);

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setMessage("Update course successfully.");

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR')")
    public Response<Void> deleteCourse(String email, Long courseId) {
        Response<Void> response = new Response<>();

        var instructor = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var course = courseRepository.findByIdAndInstructorId(courseId, instructor.getId()).orElseThrow(() -> new CustomNotFoundException("Course not found."));
        courseRepository.delete(course);

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setMessage("Deleted course successfully.");

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR')")
    public Response<List<CourseDto>> getAllOwnedCourses(String email) {
        Response<List<CourseDto>> response = new Response<>();

        var instructor = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var courses = courseRepository.findAllByInstructorId(instructor.getId())
                .stream()
                .map((c) -> new CourseDto(c.getId(), c.getTitle(), c.getDescription(), c.getStatus().name(), c.getResults(), c.getImageUrl(), c.getInstructor().getFullName()))
                .toList();

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setData(courses);

        return response;
    }
}
