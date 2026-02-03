package com.TranTienAnh.CoreService.Services.Interfaces;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {
    String saveAvatar(MultipartFile file, Long userId) throws IOException;
}
