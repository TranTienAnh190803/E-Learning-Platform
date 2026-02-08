package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.DTOs.LessonDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Exceptions.CustomBadRequestException;
import com.TranTienAnh.CoreService.Exceptions.CustomNotFoundException;
import com.TranTienAnh.CoreService.Forms.LessonForm;
import com.TranTienAnh.CoreService.Models.Entities.Lesson;
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
import java.util.List;

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

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR')")
    @Transactional
    public Response<Void> addLesson(Long courseId, LessonForm lessonForm) throws IOException {
        Response<Void> response = new Response<>();

        var course = courseRepository.findById(courseId).orElseThrow(() -> new CustomNotFoundException("Course not found"));
        Lesson lesson = new Lesson(
                lessonForm.getTitle(),
                lessonForm.getLessonType(),
                lessonForm.getContent(),
                course
        );

        var newLesson = lessonRepository.save(lesson);

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
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR', 'STUDENT')")
    public Response<List<LessonDto>> getAll(Long courseId, String email) {
        Response<List<LessonDto>> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var course = courseRepository.findById(courseId).orElseThrow(() -> new CustomNotFoundException("Course not found."));
        if (user.getRole() == Role.INSTRUCTOR && !course.getInstructor().getEmail().equals(email)) {
            throw new CustomBadRequestException("This course is not belong to you.");
        }
        var check = enrollmentRepository.existsByStudentIdAndCourseId(user.getId(), course.getId());
        if (user.getRole() == Role.STUDENT && !check) {
            throw new CustomBadRequestException("You haven't enrolled this course lesson yet.");
        }

        var lessonList = lessonRepository.findAllByCourseId(courseId)
                .stream()
                .map((l) -> new LessonDto(l.getId(), l.getTitle(), l.getLessonType().name(), l.getContent(), l.getContentUrl()))
                .toList();

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
                lesson.getContentUrl()
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


        if (lessonForm.getVideoFile() != null) {
            String url = fileService.saveVideo(lessonForm.getVideoFile(), lesson.getId(), "lesson");
            lesson.setContentUrl(url);
        }
        lesson.setTitle(lessonForm.getTitle());
        lesson.setContent(lessonForm.getContent());
        lesson.setLessonType(lessonForm.getLessonType());

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
