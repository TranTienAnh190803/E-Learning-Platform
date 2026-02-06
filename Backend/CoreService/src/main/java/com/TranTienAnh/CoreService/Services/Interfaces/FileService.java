package com.TranTienAnh.CoreService.Services.Interfaces;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {
    String saveImage(MultipartFile file, Long id, String directory) throws IOException;

    String saveVideo(MultipartFile file, Long id, String directory) throws IOException;
}
