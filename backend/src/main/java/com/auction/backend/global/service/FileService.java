package com.auction.backend.global.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class FileService {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            File directory = new File(uploadDir).getAbsoluteFile();
            if (!directory.exists()) {
                boolean created = directory.mkdirs();
                log.info("Upload directory created at {}: {}", directory.getPath(), created);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String savedFilename = UUID.randomUUID().toString() + extension;
            Path filePath = directory.toPath().resolve(savedFilename);

            log.info("Saving file to: {}", filePath.toAbsolutePath());
            file.transferTo(filePath.toFile());

            // 웹에서 접근 가능한 경로 반환 (예: /uploads/filename.jpg)
            return "/uploads/" + savedFilename;
        } catch (IOException e) {
            log.error("파일 업로드 실패 (경로: " + uploadDir + ")", e);
            throw new RuntimeException("파일 업로드 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
