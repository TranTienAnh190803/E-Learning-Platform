package com.TranTienAnh.CoreService.Repositories;

import com.TranTienAnh.CoreService.Models.Entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
