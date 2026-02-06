package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Exceptions.CustomBadRequestException;
import com.TranTienAnh.CoreService.Exceptions.CustomNotFoundException;
import com.TranTienAnh.CoreService.Models.Entities.Enrollment;
import com.TranTienAnh.CoreService.Repositories.CourseRepository;
import com.TranTienAnh.CoreService.Repositories.EnrollmentRepository;
import com.TranTienAnh.CoreService.Repositories.UserRepository;
import com.TranTienAnh.CoreService.Services.Interfaces.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @PreAuthorize("hasAnyAuthority('STUDENT')")
    public Response<Void> enrollCourse(Long courseId, String password, String email) {
        Response<Void> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var course = courseRepository.findById(courseId).orElseThrow(() -> new CustomNotFoundException("Course not found."));

        // Khóa học không công khai (nhập sai mật khẩu)
        if (!course.getPublic() && passwordEncoder.matches(password, course.getPassword()))
            throw new CustomBadRequestException("Wrong enrollment password");

        Enrollment enrollment = new Enrollment(
                user,
                course,
                LocalDateTime.now(),
                0
        );
        enrollmentRepository.save(enrollment);

        return  response;
    }
}
