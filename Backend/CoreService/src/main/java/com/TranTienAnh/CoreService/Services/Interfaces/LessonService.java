package com.TranTienAnh.CoreService.Services.Interfaces;

import com.TranTienAnh.CoreService.DTOs.LessonDto;
import com.TranTienAnh.CoreService.DTOs.LessonListDto;
import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Forms.LessonForm;

import java.io.IOException;
import java.util.List;

public interface LessonService {
    Response<Void> addLesson(Long courseId, LessonForm lessonForm, String token) throws IOException;

    Response<List<LessonListDto>> getAll(Long courseId);

    Response<LessonDto> getLesson(Long lessonId, String email);

    Response<Void> updateLesson(Long lessonId, LessonForm lessonForm, String email) throws IOException;

    Response<Void> deleteLesson(Long lessonId, String email);
}
