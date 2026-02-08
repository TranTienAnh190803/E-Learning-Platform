package com.TranTienAnh.CoreService.Repositories;

import com.TranTienAnh.CoreService.Models.EmbeddedId.EnrollmentId;
import com.TranTienAnh.CoreService.Models.Entities.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    List<Enrollment> findAllByStudentId(Long studentId);
}
