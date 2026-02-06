package com.TranTienAnh.CoreService.Repositories;

import com.TranTienAnh.CoreService.Models.Entities.Course;
import com.TranTienAnh.CoreService.Models.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByIdAndInstructorId(Long id, Long instructorId);

    List<Course> findAllByInstructorId(Long instructorId);
}
