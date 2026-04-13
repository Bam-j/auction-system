package com.auction.backend.global.service.impl;

import com.auction.backend.global.exception.io.FileUploadException;
import com.auction.backend.global.service.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@ConditionalOnProperty(name = "file.storage-type", havingValue = "local", matchIfMissing = true)
public class LocalFileService implements FileService {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    @Override
    @Async("taskExecutor")
    public CompletableFuture<String> uploadFileAsync(MultipartFile file) {
        return CompletableFuture.completedFuture(uploadFile(file));
    }

    @Override
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

            log.info("Saving file to (Local): {}", filePath.toAbsolutePath());
            file.transferTo(filePath.toFile());

            // 웹에서 접근 가능한 로컬 경로 반환
            return "/uploads/" + savedFilename;
        } catch (IOException e) {
            log.error("파일 업로드 실패 (경로: " + uploadDir + ")", e);
            throw new FileUploadException("파일 업로드 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith("/uploads/")) {
            return;
        }

        String filename = fileUrl.replace("/uploads/", "");
        File file = new File(uploadDir, filename).getAbsoluteFile();
        if (file.exists()) {
            boolean deleted = file.delete();
            log.info("Local file deleted: {}, status: {}", filename, deleted);
        }
    }
}
