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
    public String saveAvatar(MultipartFile file, Long userId) throws IOException {

        List<String> allowed = List.of("image/jpeg", "image/png", "image/webp");
        if (!allowed.contains(file.getContentType())) {
            throw new CustomBadRequestException("File không phải ảnh");
        }

        Path uploadPath = Paths.get(uploadDir, "avatar");

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
                    if (existingBaseName.equals(userId.toString())) {
                        Files.delete(path);
                    }
                }
            }
        }

        String fileName = userId + extension;
        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath.toString();
    }
}
