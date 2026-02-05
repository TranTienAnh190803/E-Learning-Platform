package com.TranTienAnh.CoreService.Repositories;

import com.TranTienAnh.CoreService.Models.EmbeddedId.EnrollmentId;
import com.TranTienAnh.CoreService.Models.Entities.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {
}
