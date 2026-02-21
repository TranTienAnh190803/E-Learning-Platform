package com.TranTienAnh.CoreService.Controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("file-api")
public class FileController {

    @PostMapping("public/read-file")
    public ResponseEntity<byte[]> readFileImage(@RequestParam("file") MultipartFile file) throws IOException {
        var fileBytes = file.getBytes();
        var fileType = file.getContentType();
        assert fileType != null;

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(fileType)).body(fileBytes);
    }
}
