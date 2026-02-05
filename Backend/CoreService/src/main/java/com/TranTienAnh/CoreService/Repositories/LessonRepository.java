package com.TranTienAnh.CoreService.Repositories;

import com.TranTienAnh.CoreService.Models.Entities.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}
