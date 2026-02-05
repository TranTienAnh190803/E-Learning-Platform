package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.Repositories.LessonRepository;
import com.TranTienAnh.CoreService.Services.Interfaces.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LessonServiceImpl implements LessonService {
    @Autowired
    private LessonRepository lessonRepository;
}
