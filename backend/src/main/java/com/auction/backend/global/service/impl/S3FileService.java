package com.auction.backend.global.service.impl;

import com.auction.backend.global.exception.io.FileUploadException;
import com.auction.backend.global.service.FileService;
import io.awspring.cloud.s3.ObjectMetadata;
import io.awspring.cloud.s3.S3Resource;
import io.awspring.cloud.s3.S3Template;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "file.storage-type", havingValue = "s3")
public class S3FileService implements FileService {

    private final S3Template s3Template;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

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
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String savedFilename = UUID.randomUUID().toString() + extension;

            log.info("Saving file to S3: {}", savedFilename);

            ObjectMetadata metadata = ObjectMetadata.builder()
                    .contentType(file.getContentType())
                    .build();

            S3Resource s3Resource = s3Template.upload(bucket, savedFilename, file.getInputStream(), metadata);

            // S3의 공개 URL 반환
            return s3Resource.getURL().toString();
        } catch (IOException e) {
            log.error("S3 파일 업로드 실패", e);
            throw new FileUploadException("S3 파일 업로드 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null) return;
        
        try {
            // URL에서 키(파일명) 추출 (도메인 이후 부분)
            // 예: https://bucket.s3.region.amazonaws.com/uuid.jpg -> uuid.jpg
            String key = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            s3Template.deleteObject(bucket, key);
            log.info("S3 file deleted: {}", key);
        } catch (Exception e) {
            log.warn("S3 파일 삭제 실패: {}", fileUrl, e);
        }
    }
}
