package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.API.RealtimeService;
import com.TranTienAnh.CoreService.DTOs.LessonDto;
import com.TranTienAnh.CoreService.DTOs.LessonListDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Exceptions.CustomBadRequestException;
import com.TranTienAnh.CoreService.Exceptions.CustomNotFoundException;
import com.TranTienAnh.CoreService.Forms.LessonForm;
import com.TranTienAnh.CoreService.Forms.NotificationForm;
import com.TranTienAnh.CoreService.Models.Entities.Lesson;
import com.TranTienAnh.CoreService.Models.Enums.CourseStatus;
import com.TranTienAnh.CoreService.Models.Enums.LessonType;
import com.TranTienAnh.CoreService.Models.Enums.Role;
import com.TranTienAnh.CoreService.Repositories.CourseRepository;
import com.TranTienAnh.CoreService.Repositories.EnrollmentRepository;
import com.TranTienAnh.CoreService.Repositories.LessonRepository;
import com.TranTienAnh.CoreService.Repositories.UserRepository;
import com.TranTienAnh.CoreService.Services.Interfaces.FileService;
import com.TranTienAnh.CoreService.Services.Interfaces.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LessonServiceImpl implements LessonService {
    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private RealtimeService realtimeService;

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR')")
    @Transactional
    public Response<Void> addLesson(Long courseId, LessonForm lessonForm, String token) throws IOException {
        Response<Void> response = new Response<>();

        var course = courseRepository.findById(courseId).orElseThrow(() -> new CustomNotFoundException("Course not found"));
        Lesson lesson = new Lesson(
                lessonForm.getTitle(),
                lessonForm.getLessonType(),
                lessonForm.getContent(),
                course,
                LocalDateTime.now()
        );

        var newLesson = lessonRepository.save(lesson);

        course.setStatus(CourseStatus.Update);
        courseRepository.save(course);

        // Push Notification to All Student (Call API pushNotification from RealtimeService)
        var allStudent = enrollmentRepository.findAllByCourseId(courseId)
                .stream()
                .map(e -> e.getStudent().getId())
                .toList();
        NotificationForm notificationForm = new NotificationForm(
                courseId,
                0,
                "New lesson added",
                "The course " + course.getTitle() + " of instructor " + course.getInstructor().getFullName() + "has added more lessons.",
                lesson.getId().toString(),
                allStudent
        );
        var notificationResponse = realtimeService.pushNotification(token, notificationForm);
        if (!notificationResponse.isSuccess())
            throw new CustomBadRequestException(notificationResponse.getMessage());

        // Save Video
        String videoUrl = null;
        if (lessonForm.getVideoFile() != null) {
            videoUrl = fileService.saveVideo(lessonForm.getVideoFile(), newLesson.getId(), "lesson");
            newLesson.setContentUrl(videoUrl);
            lessonRepository.save(newLesson);
        }

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setMessage("Add lesson successfully");

        return response;
    }

    @Override
    public Response<List<LessonListDto>> getAll(Long courseId) {
        Response<List<LessonListDto>> response = new Response<>();

        var lessonList = lessonRepository.findAllByCourseId(courseId)
                .stream()
                .map(l -> new LessonListDto(l.getId(), l.getTitle(), l.getAddedDate()))
                .collect(Collectors.toList());

        lessonList.sort(
                Comparator.comparing(
                        LessonListDto::getAddedDate,
                        Comparator.nullsLast(Comparator.naturalOrder())
                )
        );

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setData(lessonList);

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR', 'STUDENT')")
    public Response<LessonDto> getLesson(Long lessonId, String email) {
        Response<LessonDto> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var lesson = lessonRepository.findById(lessonId).orElseThrow(() -> new CustomNotFoundException("Lesson not found."));
        var course = courseRepository.findById(lesson.getCourse().getId()).orElseThrow(() -> new CustomNotFoundException("Course not found."));

        if (user.getRole() == Role.INSTRUCTOR && !course.getInstructor().getEmail().equals(email)) {
            throw new CustomBadRequestException("This course is not belong to you.");
        }
        var check = enrollmentRepository.existsByStudentIdAndCourseId(user.getId(), course.getId());
        if (user.getRole() == Role.STUDENT && !check) {
            throw new CustomBadRequestException("You haven't enrolled this course lesson yet.");
        }

        LessonDto dto = new LessonDto(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getLessonType().name(),
                lesson.getContent(),
                lesson.getContentUrl(),
                lesson.getAddedDate()
        );

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setData(dto);

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR')")
    public Response<Void> updateLesson(Long lessonId, LessonForm lessonForm, String email) throws IOException {
        Response<Void> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var lesson = lessonRepository.findById(lessonId).orElseThrow(() -> new CustomNotFoundException("Lesson not found."));
        if (!lesson.getCourse().getInstructor().equals(user)) {
            throw new CustomBadRequestException("This course is not belong to you.");
        }

        if (lessonForm.getLessonType() == LessonType.WORK) {
            lesson.setContentUrl(null);
        }
        if (lessonForm.getLessonType() == LessonType.STUDY && lessonForm.getVideoFile() != null) {
            String url = fileService.saveVideo(lessonForm.getVideoFile(), lesson.getId(), "lesson");
            lesson.setContentUrl(url);
        }
        lesson.setTitle(lessonForm.getTitle());
        lesson.setContent(lessonForm.getContent());
        lesson.setLessonType(lessonForm.getLessonType());
        lessonRepository.save(lesson);

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setMessage("Updated lesson successfully");

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR')")
    public Response<Void> deleteLesson(Long lessonId, String email) {
        Response<Void> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var lesson = lessonRepository.findById(lessonId).orElseThrow(() -> new CustomNotFoundException("Lesson not found."));
        if (!lesson.getCourse().getInstructor().equals(user)) {
            throw new CustomBadRequestException("This course is not belong to you.");
        }

        lessonRepository.delete(lesson);

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setMessage("Deleted lesson successfully");

        return response;
    }
}
