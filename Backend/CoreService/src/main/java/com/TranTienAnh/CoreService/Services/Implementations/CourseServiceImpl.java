package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.API.RealtimeService;
import com.TranTienAnh.CoreService.DTOs.CloudinaryResponseDto;
import com.TranTienAnh.CoreService.DTOs.CourseDto;
import com.TranTienAnh.CoreService.DTOs.CourseMemberDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Exceptions.CustomBadRequestException;
import com.TranTienAnh.CoreService.Exceptions.CustomNotFoundException;
import com.TranTienAnh.CoreService.Forms.*;
import com.TranTienAnh.CoreService.Models.Entities.Course;
import com.TranTienAnh.CoreService.Models.Entities.Lesson;
import com.TranTienAnh.CoreService.Models.Enums.*;
import com.TranTienAnh.CoreService.Repositories.CourseRepository;
import com.TranTienAnh.CoreService.Repositories.EnrollmentRepository;
import com.TranTienAnh.CoreService.Repositories.LessonRepository;
import com.TranTienAnh.CoreService.Repositories.UserRepository;
import com.TranTienAnh.CoreService.Services.Interfaces.CourseService;
import com.TranTienAnh.CoreService.Services.Interfaces.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
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

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private RealtimeService realtimeService;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Value("${kafka.topic.notification}")
    private String notificationTopic;

    @Value("${kafka.topic.chat}")
    private String chatTopic;

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR')")
    @Transactional
    public Response<Void> addCourse(String email, String token, CourseCreateForm courseForm) throws IOException {
        Response<Void> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found"));

        // Create Course
        String password = null;
        if (!courseForm.isPublicCourse())
            password = passwordEncoder.encode(courseForm.getPassword());

        Course course = new Course(
                courseForm.getTitle(),
                courseForm.getDescription(),
                CourseStatus.New,
                courseForm.getResults(),
                courseForm.isPublicCourse(),
                password,
                user
        );
        var newCourse = courseRepository.save(course);

        // Create First Lesson
        Lesson lesson = new Lesson(
                courseForm.getLessonTitle(),
                courseForm.getLessonType(),
                courseForm.getContent(),
                newCourse,
                LocalDateTime.now()
        );
        var newLesson = lessonRepository.save(lesson);

        // Save File
        // Image (Course)
        if (courseForm.getImage() != null) {
//            image = fileService.saveImage(courseForm.getImage(), newCourse.getId(), "course");
            CloudinaryResponseDto result1 = cloudinaryService.uploadFile(
                    courseForm.getImage(),
                    CloudFolder.courses.name(),
                    FileType.image.name(),
                    newCourse.getId().toString()
            );
            newCourse.setImageUrl(result1.getContentUrl());
            courseRepository.save(newCourse);
        }
        // Video (Lesson)
        if (courseForm.getVideoFile() != null) {
//            videoUrl = fileService.saveVideo(courseForm.getVideoFile(), newLesson.getId(), "lesson");
            CloudinaryResponseDto result2 = cloudinaryService.uploadFile(
                    courseForm.getVideoFile(),
                    CloudFolder.lessons.name(),
                    FileType.video.name(),
                    newLesson.getId().toString()
            );
            newLesson.setContentUrl(result2.getContentUrl());
            lessonRepository.save(newLesson);
        }

        // Create Chat Room
        ChatRoomCreateForm chatRoomForm = new ChatRoomCreateForm(
                newCourse.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getId(),
                newCourse.getTitle()
        );
        Events<ChatRoomCreateForm> event = new Events<>(
                EventsName.CREATE_CHATROOM.name(),
                chatRoomForm
        );
//        var chatRoomResponse = realtimeService.createChatRoom(token, chatRoomForm);
//        if (!chatRoomResponse.isSuccess())
//            throw new CustomBadRequestException(chatRoomResponse.getMessage());
        kafkaProducerService.sendMessage(chatTopic, user.getId().toString(), event);

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
                course.getInstructor().getFullName(),
                course.getPublic()
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
                .map((c) -> new CourseDto(c.getId(), c.getTitle(), c.getDescription(), c.getStatus().name(), c.getResults(), c.getImageUrl(), c.getInstructor().getFullName(), c.getPublic(), c.getInstructor().getAvatarPath()))
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
//            String image = fileService.saveImage(courseForm.getImage(), instructor.getId(), "course");
            CloudinaryResponseDto result = cloudinaryService.uploadFile(
                    courseForm.getImage(),
                    CloudFolder.courses.name(),
                    FileType.image.name(),
                    course.getId().toString()
            );
            course.setImageUrl(result.getContentUrl());
        }

        if (courseForm.isPublicCourse())
            course.setPassword(null);
        else
            course.setPassword(passwordEncoder.encode(courseForm.getPassword()));

        course.setTitle(courseForm.getTitle());
        course.setDescription(courseForm.getDescription());
        course.setResults(courseForm.getResults());
        course.setPublic(courseForm.isPublicCourse());
        course.setStatus(CourseStatus.Update);
        courseRepository.save(course);

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setMessage("Update course successfully.");

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR')")
    @Transactional
    public Response<Void> deleteCourse(String email, Long courseId, String token) throws IOException {
        Response<Void> response = new Response<>();

        var instructor = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var course = courseRepository.findByIdAndInstructorId(courseId, instructor.getId()).orElseThrow(() -> new CustomNotFoundException("Course not found."));

        // Delete relevant file on Cloud
        if (course.getImageUrl() != null) {
            cloudinaryService.deleteFile(
                    CloudFolder.courses.name() + "/" + course.getId().toString(),
                    FileType.image.name()
            );

            List<Long> courseLessons = course.getLesson().stream().map(Lesson::getId).toList();
            cloudinaryService.deleteListLessonFile(courseLessons);
        }

        courseRepository.delete(course);

        // Delete chat room
//        var chatRoomResponse = realtimeService.deleteChatRoom(token, courseId);
//        if (!chatRoomResponse.isSuccess())
//            throw new CustomBadRequestException(chatRoomResponse.getMessage());
        Events<Long> event1 = new Events<>(EventsName.DELETE_CHATROOM.name(), courseId);
        kafkaProducerService.sendMessage(chatTopic, instructor.getId().toString(), event1);

        // Push Notification (Send message by using Kafka)
        var allStudent = enrollmentRepository.findAllByCourseId(courseId)
                .stream()
                .map(e -> e.getStudent().getId())
                .toList();
        NotificationForm notificationForm = new NotificationForm(
                courseId,
                2,
                "Course Deleted",
                "The course " + course.getTitle() + " of instructor " + course.getInstructor().getFullName() + "has been deleted.",
                null,
                allStudent
        );
        Events<NotificationForm> event2 = new Events<>(
                EventsName.NOTIFICATION_PUSH.name(),
                notificationForm
        );
//        var notificationResponse = realtimeService.pushNotification(token, notificationForm);
//        if (!notificationResponse.isSuccess())
//            throw new CustomBadRequestException(notificationResponse.getMessage());
        kafkaProducerService.sendMessage(notificationTopic, courseId.toString(), event2);

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
                .map((c) -> new CourseDto(c.getId(), c.getTitle(), c.getDescription(), c.getStatus().name(), c.getResults(), c.getImageUrl(), c.getInstructor().getFullName(), c.getPublic()))
                .toList();

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setData(courses);

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR')")
    public Response<List<Long>> getOwnedCourseId(String email) {
        Response<List<Long>> response = new Response<>();

        var instructor = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var courses = courseRepository.findAllByInstructorId(instructor.getId())
                .stream()
                .map(Course::getId)
                .toList();

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setData(courses);

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR')")
    public Response<Void> completeUpdateCourse(String email, Long courseId) {
        Response<Void> response = new Response<>();

        var instructor = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var course = courseRepository.findByIdAndInstructorId(courseId, instructor.getId()).orElseThrow(() -> new CustomNotFoundException("Course not found."));

        course.setStatus(CourseStatus.Complete);
        courseRepository.save(course);

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setMessage("Course have completed.");

        return response;
    }

    @Override
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR', 'STUDENT')")
    public Response<List<CourseMemberDto>> getMemeber(String email, Long courseId) {
        Response<List<CourseMemberDto>> response = new Response<>();

        var user = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        List<CourseMemberDto> result = List.of();

        if (user.getRole() == Role.INSTRUCTOR) {
            var course = courseRepository.findByIdAndInstructorId(courseId, user.getId()).orElseThrow(() -> new CustomNotFoundException("Course not found."));
            result = enrollmentRepository.findAllByCourseId(courseId)
                    .stream()
                    .map(e -> new CourseMemberDto(e.getStudent().getId(), e.getStudent().getFullName(), e.getStudent().getEmail(), e.getStudent().getAvatarPath()))
                    .toList();
        }
        if (user.getRole() == Role.STUDENT) {
            var enrollment = enrollmentRepository.findByStudentIdAndCourseId(user.getId(), courseId).orElseThrow(() -> new CustomBadRequestException("You haven't enrolled this course."));
            result = enrollmentRepository.findAllByCourseId(courseId)
                    .stream()
                    .map(e -> new CourseMemberDto(e.getStudent().getId(), e.getStudent().getFullName(), e.getStudent().getEmail(), e.getStudent().getAvatarPath()))
                    .toList();
        }

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setData(result);


        return response;
    }

    @Override
    public Response<Void> kickMember(String email, Long courseId, Long studentId) {
        Response<Void> response = new Response<>();

        var instructor = userRepository.findByEmail(email).orElseThrow(() -> new CustomNotFoundException("User not found."));
        var course = courseRepository.findByIdAndInstructorId(courseId, instructor.getId()).orElseThrow(() -> new CustomNotFoundException("Course not found."));

        var enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId).orElseThrow(() -> new CustomNotFoundException("This student is not belong to this course."));
        enrollmentRepository.delete(enrollment);

        ChatRoomLeavingForm chatRoomLeavingForm = new ChatRoomLeavingForm(courseId, studentId);
        Events<ChatRoomLeavingForm> event = new Events<>(EventsName.LEAVE_CHATROOM.name(), chatRoomLeavingForm);
        kafkaProducerService.sendMessage(chatTopic, instructor.getId().toString(), event);

        response.setSuccess(true);
        response.setStatusCode(200);
        response.setMessage("Remove member successfully.");

        return response;
    }
}
