package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.DTOs.CloudinaryResponseDto;
import com.TranTienAnh.CoreService.Exceptions.CustomBadRequestException;
import com.TranTienAnh.CoreService.Models.Enums.FileType;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;

    // Validate file
    private void validateFile(MultipartFile file, String type) {
        if (file.isEmpty())
            throw new CustomBadRequestException("File is empty.");

        String contentType = file.getContentType();

        if (type.equals(FileType.image.name()) && (contentType == null || !contentType.startsWith(FileType.image.name())))
            throw new CustomBadRequestException("Invalid image file");
        if (type.equals(FileType.video.name()) && (contentType == null || !contentType.startsWith(FileType.video.name())))
            throw new CustomBadRequestException("Invalid video file");
    }

    // Upload File
    public CloudinaryResponseDto uploadFile(MultipartFile file, String folder, String type, String publicId) throws IOException {
        Map<String, Object> options = ObjectUtils.asMap(
                "folder", folder,
                "resource_type", type,
                "public_id", publicId,
                "overwrite", true,
                "invalidate", true
        );

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                options
        );

        return new CloudinaryResponseDto(
                uploadResult.get("secure_url").toString(),
                uploadResult.get("public_id").toString()
        );
    }

    // Delete File
    public void deleteFile(String publicId, String type) throws IOException {
        cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.asMap(
                        "resource_type", type
                )
        );
    }
}
