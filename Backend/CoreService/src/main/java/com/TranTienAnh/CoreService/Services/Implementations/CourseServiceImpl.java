package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.Repositories.CourseRepository;
import com.TranTienAnh.CoreService.Services.Interfaces.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CourseServiceImpl implements CourseService {
    @Autowired
    private CourseRepository courseRepository;
}
