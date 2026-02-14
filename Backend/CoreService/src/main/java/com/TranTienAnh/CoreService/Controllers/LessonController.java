package com.TranTienAnh.CoreService.Controllers;

import com.TranTienAnh.CoreService.DTOs.LessonDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Forms.LessonForm;
import com.TranTienAnh.CoreService.Services.Interfaces.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("lesson-api")
public class LessonController {
    @Autowired
    private LessonService lessonService;

    @PostMapping("add-lesson/{courseId}")
    public ResponseEntity<Response<Void>> addLesson(@PathVariable("courseId") Long courseId, @ModelAttribute LessonForm lessonForm) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String token = (String) authentication.getDetails();
        Response<Void> response = lessonService.addLesson(courseId, lessonForm, token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("get-all/{courseId}")
    public ResponseEntity<Response<List<LessonDto>>> getAll(@PathVariable("courseId") Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();
        Response<List<LessonDto>> response = lessonService.getAll(courseId, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("get-lesson/{lessonId}")
    public ResponseEntity<Response<LessonDto>> getLesson(@PathVariable("lessonId") Long lessonId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();
        Response<LessonDto> response = lessonService.getLesson(lessonId, email);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("update-lesson/{lessonId}")
    public ResponseEntity<Response<Void>> updateLesson(@PathVariable("lessonId") Long lessonId, @ModelAttribute LessonForm lessonForm) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();
        Response<Void> response = lessonService.updateLesson(lessonId, lessonForm, email);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("delete-lesson/{lessonId}")
    public ResponseEntity<Response<Void>> deleteLesson(@PathVariable("lessonId") Long lessonId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();
        Response<Void> response = lessonService.deleteLesson(lessonId, email);
        return ResponseEntity.ok(response);
    }
}
