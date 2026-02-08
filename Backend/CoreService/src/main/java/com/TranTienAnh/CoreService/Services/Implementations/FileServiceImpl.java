package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.Exceptions.CustomBadRequestException;
import com.TranTienAnh.CoreService.Services.Interfaces.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Service
public class FileServiceImpl implements FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private String getBaseName(String filename) {
        int lastDot = filename.lastIndexOf(".");
        if (lastDot == -1) {
            return filename;
        }
        return filename.substring(0, lastDot);
    }

    @Override
    public String saveImage(MultipartFile file, Long id, String directory) throws IOException {

        List<String> allowed = List.of("image/jpeg", "image/png", "image/webp");
        if (!allowed.contains(file.getContentType())) {
            throw new CustomBadRequestException("File is not image");
        }

        Path uploadPath = Paths.get(uploadDir, directory);

        Files.createDirectories(uploadPath);

        // Lấy extension
        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Xóa các avatar cũ của user (khác đuôi vẫn xóa)
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(uploadPath)) {
            for (Path path : stream) {
                if (Files.isRegularFile(path)) {
                    String existingBaseName = getBaseName(path.getFileName().toString());
                    if (existingBaseName.equals(id.toString())) {
                        Files.delete(path);
                    }
                }
            }
        }

        String fileName = id + extension;
        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath.toString().replace("\\", "/");
    }

    @Override
    public String saveVideo(MultipartFile file, Long id, String directory) throws IOException {
//        List<String> allowed = List.of("video/mp4", "video/webm", "video/wmv");
//        if (!allowed.contains(file.getContentType())) {
//            throw new CustomBadRequestException("File is not video");
//        }

        Path uploadPath = Paths.get(uploadDir, directory);

        Files.createDirectories(uploadPath);

        // Lấy extension
        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Xóa các avatar cũ của user (khác đuôi vẫn xóa)
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(uploadPath)) {
            for (Path path : stream) {
                if (Files.isRegularFile(path)) {
                    String existingBaseName = getBaseName(path.getFileName().toString());
                    if (existingBaseName.equals(id.toString())) {
                        Files.delete(path);
                    }
                }
            }
        }

        String fileName = id + extension;
        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath.toString().replace("\\", "/");
    }
}
