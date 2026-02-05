package com.TranTienAnh.CoreService.Controllers;

import com.TranTienAnh.CoreService.Services.Interfaces.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("lesson-api")
public class LessonController {
    @Autowired
    private LessonService lessonService;
}
