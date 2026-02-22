package com.TranTienAnh.CoreService.Repositories;

import com.TranTienAnh.CoreService.Models.EmbeddedId.LearningProcessId;
import com.TranTienAnh.CoreService.Models.Entities.LearningProcess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningProcessRepository extends JpaRepository<LearningProcess, LearningProcessId> {
    List<LearningProcess> findAllByStudentIdAndCourseId(Long studentId, Long courseId);
}
