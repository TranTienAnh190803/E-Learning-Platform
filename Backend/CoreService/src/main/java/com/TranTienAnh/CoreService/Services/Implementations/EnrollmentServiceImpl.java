package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.API.RealtimeService;
import com.TranTienAnh.CoreService.DTOs.EnrollmentDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Exceptions.CustomBadRequestException;
import com.TranTienAnh.CoreService.Exceptions.CustomNotFoundException;
import com.TranTienAnh.CoreService.Forms.NotificationForm;
import com.TranTienAnh.CoreService.Models.Entities.Enrollment;
import com.TranTienAnh.CoreService.Models.Entities.LearningProcess;
import com.TranTienAnh.CoreService.Repositories.*;
import com.TranTienAnh.CoreService.Services.Interfaces.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RealtimeService realtimeService;

    @Autowired
    private LearningProcessRepository learningProcessRepository;

    @Override
    @PreAuthorize("hasAnyAuthority('STUDENT')")
    public Response<Void> enrollCourse(Long courseId, String password, String email, String token) {
        Response<Void> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var course = courseRepository.findById(courseId).orElseThrow(() -> new CustomNotFoundException("Course not found."));

        // Khóa học không công khai (nhập sai mật khẩu)
        if (!course.getPublic() && !passwordEncoder.matches(password, course.getPassword()))
            throw new CustomBadRequestException("Wrong enrollment password");

        Enrollment enrollment = new Enrollment(
                user,
                course,
                LocalDateTime.now(),
                0
        );
        enrollmentRepository.save(enrollment);

        // Gửi thông báo đến giảng viên (gọi API pushNotification - pushNotification là side job)
        List<Long> instructorId = List.of(course.getInstructor().getId());
        NotificationForm notificationForm = new NotificationForm(
                1,
                "Student " + user.getFullName() + " has enrolled course " + course.getTitle(),
                "",
                "/student-list",
                instructorId
        );
        var notificationResponse = realtimeService.pushNotification(token, notificationForm);

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setMessage("Enrolled course successfully");

        return  response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('STUDENT')")
    public Response<List<EnrollmentDto>> getEnrolledCourse(String email) {
        Response<List<EnrollmentDto>> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var enrolledCourses = enrollmentRepository.findAllByStudentId(user.getId())
                .stream()
                .map(e -> new EnrollmentDto(e.getCourse().getId(), e.getCourse().getTitle(), e.getCourse().getDescription(), e.getCourse().getStatus().name(), e.getCourse().getResults(), e.getCourse().getImageUrl(), e.getCourse().getInstructor().getFullName(), e.getCourse().getPublic(), e.getEnrollAt(), e.getStatus()))
                .toList();

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setData(enrolledCourses);

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('STUDENT')")
    public Response<List<?>> getCourseForSocket(String email) {
        Response<List<?>> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var enrolledCourses = enrollmentRepository.findAllByStudentId(user.getId())
                .stream()
                .map(e -> e.getCourse().getId())
                .toList();

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setData(enrolledCourses);

        return response;
    }

    @Override
    public Response<Void> updateProcess(Long courseId, Long lessonId, String email) {
        Response<Void> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User Not Found"));
        var course = courseRepository.findById(courseId).orElseThrow(() -> new CustomNotFoundException("Course Not Found"));
        var enrollment = enrollmentRepository.findByStudentIdAndCourseId(user.getId(), courseId).orElseThrow(() -> new CustomBadRequestException("You haven't enrolled this course yet"));
        var lesson = lessonRepository.findById(lessonId).orElseThrow(() -> new CustomNotFoundException("Lesson Not Found"));


        if (!lesson.getCourse().getId().equals(courseId)) {
            throw new CustomBadRequestException("This lesson does not belong to this course");
        }

        LearningProcess learningProcess = new LearningProcess(user, course, lesson);
        learningProcessRepository.save(learningProcess);

        var lessonList = lessonRepository.findAllByCourseId(courseId);
        var completedLesson = learningProcessRepository.findAllByStudentIdAndCourseId(user.getId(), courseId);
        var percentage = ((completedLesson.size() / lessonList.size()) * 100);

        enrollment.setStatus(Math.min(percentage, 100));
        enrollmentRepository.save(enrollment);

        response.setStatusCode(200);
        response.setSuccess(true);

        return response;
    }

    @Override
    public Response<Void> leaveCourse(Long courseId, String email) {
        Response<Void> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var course = courseRepository.findById(courseId).orElseThrow(() -> new CustomNotFoundException("Course not found."));

        var enrollment = enrollmentRepository.findByStudentIdAndCourseId(user.getId(), course.getId()).orElseThrow(() -> new CustomBadRequestException("You haven't enrolled this course yet."));
        enrollmentRepository.delete(enrollment);

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setMessage("Leave course successfully");

        return  response;
    }
}
