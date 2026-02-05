package com.TranTienAnh.CoreService.Controllers;

import com.TranTienAnh.CoreService.Services.Interfaces.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("course-api")
public class CourseController {
    @Autowired
    private CourseService courseService;
}
